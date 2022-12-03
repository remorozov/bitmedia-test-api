const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const mongoose = require('mongoose')

const {getTransactions, getNewBlock} = require('./blocks')


const app = express()
app.use(bodyParser.json())

const httpClient = axios.create()
httpClient.defaults.timeout = 10000
httpClient.defaults.bodeLength = Infinity

app.get('/', async (req, res) => {
  res.send('Hello')
})

const start = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://remorozov:taskManager@transactions.zajwepq.mongodb.net/?retryWrites=true&w=majority'
  try {
    await mongoose.connect()
  }catch(err){
    console.log(err.message)
  }
  const time = Date.now()
  const transactions = await getTransactions()
  console.log(Date.now() - time)
  console.log(transactions[0])
  // setInterval(() => {
  //   getNewBlock()
  // }, 12000)

  const port = process.env.PORT || 4000
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}

start()
