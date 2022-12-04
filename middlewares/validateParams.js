const Transaction = require('../models/Transaction')

const validatePage = (req, res, next) => {
  const page = req.query.page

  if (!page || +page < 1 || !Number.isInteger(+page)) {
    return res.status(400).send({
      error: 'Invalid page',
    })
  }

  req.page = page
  next()
}

const validateBlock = async (req, res, next) => {
  try {
    const block = req.params.block
    if (!block || block < 1 || !Number.isInteger(+block)) {
      return res.status(400).send({
        error: 'Invalid block number',
      })
    }

    const pagesNumber = Math.ceil((await Transaction.countDocuments({ block: +block })) / 15)
    if (pagesNumber === 0) {
      return res.status(404).send({
        error: 'No transactions found',
      })
    }
    if (pagesNumber < req.page) {
      return res.status(400).send({
        error: 'Invalid page',
      })
    }

    req.block = block
    req.pagesNumber = pagesNumber
    next()
  } catch (err) {
    return res.status(500).send({
      error: 'Failed connection',
    })
  }
}

const validateHash = (req, res, next) => {
  const hash = req.params.hash
  if (!hash) {
    return res.status(400).send({
      error: 'No hash',
    })
  }
  req.hash = hash
  next()
}

const validateAddress = async (req, res, next) => {
  try {
    const address = req.params.address
    if (!address) {
      return res.status(400).send({
        error: 'No address',
      })
    }

    const pagesNumber = Math.ceil(
      (await Transaction.countDocuments({
        $or: [{ to: address }, { from: address }],
      })) / 15
    )
    if (pagesNumber === 0) {
      return res.status(404).send({
        error: 'No transactions found',
      })
    }
    if (pagesNumber < req.page) {
      return res.status(400).send({
        error: 'Invalid page',
      })
    }

    req.address = address
    req.pagesNumber = pagesNumber
    next()
  } catch (err) {
    return res.status(500).send({
      error: 'Failed connction',
    })
  }
}

const validateNoParams = async (req, res, next) => {
  //   console.log(req)
  try {
    const pagesNumber = Math.ceil((await Transaction.countDocuments()) / 15)
    if (pagesNumber < req.page) {
      return res.status(400).send({
        error: 'Invalid page',
      })
    }

    req.pagesNumber = pagesNumber
    next()
  } catch (err) {
    return res.status(500).send({
      error: 'Failed connction',
    })
  }
}

module.exports = { validatePage, validateBlock, validateHash, validateAddress, validateNoParams }
