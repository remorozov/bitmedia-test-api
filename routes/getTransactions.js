const mongoose = require('mongoose')
const express = require('express')
const {
  validateBlock,
  validatePage,
  validateHash,
  validateAddress,
  validateNoParams,
} = require('../middlewares/validateParams')
const Transaction = require('../models/Transaction')
const { getLastBlock } = require('../middlewares/getLastBlock')

const router = new express.Router()

router.get('/transactions', validatePage, validateNoParams, getLastBlock, async (req, res) => {
  try {
    const skip = (req.page - 1) * 15
    const transactions = await Transaction.find().skip(skip).limit(15)

    res.send({
      transactions,
      pagesNumber: req.pagesNumber,
      lastBlockNumber: req.lastBlockNumber,
    })
  } catch (err) {
    res.status(500).send({
      error: 'Failed connction',
    })
  }
})

router.get('/transactions/block/:block', validatePage, validateBlock, getLastBlock, async (req, res) => {
  try {
    const skip = (req.page - 1) * 15
    const transactions = await Transaction.find({ block: req.block }).skip(skip).limit(15)

    res.send({
      transactions,
      pagesNumber: req.pagesNumber,
      lastBlockNumber: req.lastBlockNumber,
    })
  } catch (err) {
    res.status(500).send({
      error: 'Failed connection',
    })
  }
})

router.get('/transactions/hash/:hash', validateHash, getLastBlock, async (req, res) => {
  try {
    const transactions = await Transaction.find({ hash: req.hash })
    if (!transactions.length) {
      return res.status(404).send({
        error: 'No transactions found',
      })
    }

    res.send({
      transactions,
      pagesNumber: 1,
      lastBlockNumber: req.lastBlockNumber,
    })
  } catch (err) {
    res.status(500).send({
      error: 'Failed connction',
    })
  }
})

router.get('/transactions/address/:address', validatePage, validateAddress, getLastBlock, async (req, res) => {
  try {
    const skip = (req.page - 1) * 15
    const transactions = await Transaction.find({
      $or: [{ to: req.address }, { from: req.address }],
    })
      .skip(skip)
      .limit(15)

    res.send({
      transactions,
      pagesNumber: req.pagesNumber,
      lastBlockNumber: req.lastBlockNumber,
    })
  } catch (err) {
    res.status(500).send({
      error: 'Failed connction',
    })
  }
})

module.exports = {
  transactionRouter: router,
}
