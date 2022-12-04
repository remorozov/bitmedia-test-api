const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const mongoose = require('mongoose')

const { getLastBlocks, getNewBlock } = require('./blocks')
const Transaction = require('./models/Transaction')
const { transactionRouter } = require('./routes/getTransactions')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const httpClient = axios.create()
httpClient.defaults.timeout = 10000
httpClient.defaults.bodeLength = Infinity

app.use(transactionRouter)

const start = async () => {
  const MONGO_URI =
    process.env.MONGO_URI ||
    'mongodb+srv://remorozov:taskManager@transactions.zajwepq.mongodb.net/?retryWrites=true&w=majority'
  try {
    await mongoose.connect(MONGO_URI)
  } catch (err) {
    console.log(err.message)
  }

  const countTransactions = await Transaction.countDocuments()
  // if (!countTransactions) {
  //   getLastBlocks()
  // }

  // setInterval(() => {
  //   getNewBlock()
  // }, 12000)

  const port = process.env.PORT || 4000
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}

start()
