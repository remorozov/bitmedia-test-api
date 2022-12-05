const Transaction = require('../models/Transaction')

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

module.exports = { validateBlock }
