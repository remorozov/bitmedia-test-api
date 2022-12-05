const axios = require('axios')
const https = require('https')
const Transaction = require('./models/Transaction')

const httpClient = axios.create()

let blocksToInit = 5

const getLastBlockNumber = async () => {
  try {
    const { data } = await httpClient.get(
      'https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=AQEM4CV9P697CYZQMMX1SV7FFUKSJT2D67'
    )

    return parseInt(data.result)
  } catch (err) {
    console.log(err)
    return err.message
  }
}

const getBlockByNumber = async (number) => {
  try {
    const number16 = typeof number === 'number' ? `0x${number.toString(16)}` : number
    // const { data } = await httpClient.get(
    //   `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${number16}&boolean=true&apikey=AQEM4CV9P697CYZQMMX1SV7FFUKSJT2D67`
    // )

    // Error accures when trying to fetch block with all transactions using axios

    return new Promise((resolve, reject) => {
      https.get(
        `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${number16}&boolean=true&apikey=AQEM4CV9P697CYZQMMX1SV7FFUKSJT2D67`,
        (res) => {
          let rawData = ''
          res.on('data', (chunk) => {
            rawData += chunk
          })
          res.on('end', () => {
            try {
              const parsedData = JSON.parse(rawData)
              resolve(parsedData.result)
            } catch (err) {
              console.error(err.message)
            }
          })
        }
      )
    })

    // return data.result
  } catch (err) {
    console.log('Error in getBlockByNumber')
    return null
  }
}

const sleep = async (sleepTime) =>
  await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve()
      clearTimeout(timeout)
    }, sleepTime)
  })

const getLastBlocks = async () => {
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

const createTransactions = async (transactions, date) => {
  try {
    const newTransactions = transactions.map((tran) => {
      return {
        hash: tran.hash,
        block: parseInt(tran.blockNumber),
        from: tran.from,
        to: tran.to,
        gas: parseInt(tran.gas) * parseInt(tran.gasPrice) * 10 ** -18,
        date: new Date(parseInt(date) * 1000),
        value: parseInt(tran.value),
      }
    })

    await Transaction.insertMany(newTransactions)
    console.log('Block ' + transactions[0].blockNumber + ' inserted')
  } catch (err) {
    console.log(err.message)
  }
}

const getNewBlock = async () => {
  const block = await getBlockByNumber('latest')
  !!block && createTransactions(block.transactions, block.timestamp)

  console.log('New block: ', block.number)
}

module.exports = { getLastBlocks, getNewBlock, getLastBlockNumber }
