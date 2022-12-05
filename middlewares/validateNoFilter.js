const Transaction = require('../models/Transaction')

const validateNoFilter = async (req, res, next) => {
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

module.exports = { validateNoFilter }
