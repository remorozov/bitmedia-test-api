const axios = require('axios')
const https = require('https')

const httpClient = axios.create()

const blocksInitialized = 0

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
              console.log(!!parsedData.result)
              resolve(parsedData.result)
            } catch (e) {
              console.error(e.message)
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
    const blocksNum = 10
    const blocks = []

    while (blocks.length < blocksNum) {
      await sleep(1000)

      const block = await getBlockByNumber(lastBlockNumber)
      // console.log(block)
      console.log(Object.keys(block))

      !!block &&
        blocks.push({
          date: block.timestamp,
          transactions: block.transactions,
        })
      lastBlockNumber--

      // blocksInitialized++
      console.log(blocks.length)
    }

    return blocks
  } catch (err) {
    console.log('Error in getLastBlocks')
    return []
  }
}

const createTransactions = (transactions, date) => {
  
}

const getTransactions = async () => {
  try {
    const blocks = await getLastBlocks()
    const transactions = []
    blocks.forEach((block, index) => {
      if (block) {
        transactions.push(
          ...block.transactions.map((tran) => {
            return {
              hash: tran.hash,
              blockNumber: tran.blockNumber,
              from: tran.from,
              to: tran.to,
              gas: tran.gas,
              time: block.time,
              value: tran.value,
              approveNum: index,
            }
          })
        )
      }
    })

    return transactions
  } catch (err) {
    console.log(err.message)
    return []
  }
}

const getNewBlock = async () => {
  // const blockNumber = await getLastBlockNumber()
  // console.log(blockNumber)
  // const blockData = await getBlockByNumber(blockNumber)

  const blockData = await getBlockByNumber('latest')

  if (!blockData) {
    console.log('here')
    return
  }

  const transactions = blockData.transactions.map((tran) => {
    return {
      hash: tran.hash,
      blockNumber: tran.blockNumber,
      from: tran.from,
      to: tran.to,
      gas: tran.gas,
      time: blockData.time,
      value: tran.value,
      approveNum: 0,
    }
  })

  console.log(blockData.number)
}

module.exports = { getTransactions, getNewBlock }
