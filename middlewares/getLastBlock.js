const { getLastBlockNumber } = require('../blocks')

const getLastBlock = async (req, res, next) => {
  try {
    const lastBlockNumber = await getLastBlockNumber()
    req.lastBlockNumber = lastBlockNumber
    next()
  } catch (err) {
    req.lastBlockNumber = 0
    next()
  }
}

module.exports = {getLastBlock}
