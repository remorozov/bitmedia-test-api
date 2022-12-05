const { getBlockByNumber } = require('./blocks')
const { createTransactions } = require('./transactionCreator')

const getNewBlock = async () => {
  const block = await getBlockByNumber('latest')
  !!block && createTransactions(block.transactions, block.timestamp)

  // console.log('New block: ', block.number)
}

module.exports = { getNewBlock }
