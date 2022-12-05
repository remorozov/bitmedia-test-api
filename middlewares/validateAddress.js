const Transaction = require('../models/Transaction')

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
      error: 'Failed connection',
    })
  }
}

module.exports = { validateAddress }
