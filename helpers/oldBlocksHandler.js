const { createTransactions } = require('./transactionCreator')
const { getLastBlockNumber, getBlockByNumber } = require('./blocks')

const sleep = async (sleepTime) =>
  await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve()
      clearTimeout(timeout)
    }, sleepTime)
  })

const getLastBlocks = async (blocksToInit) => {
  try {
    let lastBlockNumber = await getLastBlockNumber()
    let blocksNum = 0

    while (blocksNum < blocksToInit) {
      await sleep(1000)

      const block = await getBlockByNumber(lastBlockNumber)

      !!block && createTransactions(block.transactions, block.timestamp)
      console.log('Previous block ' + block.number)
      lastBlockNumber--
      blocksNum++
    }
  } catch (err) {
    console.log('Error in getLastBlocks')
    return []
  }
}

module.exports = { getLastBlocks }
