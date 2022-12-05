const axios = require('axios')
const https = require('https')

const getLastBlockNumber = async () => {
  try {
    const { data } = await axios.get(
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
    // const { data } = await axios.get(
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

module.exports = { getBlockByNumber, getLastBlockNumber }
