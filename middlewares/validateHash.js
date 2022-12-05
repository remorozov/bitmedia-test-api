const Transaction = require('../models/Transaction')

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

module.exports = { validateHash }
