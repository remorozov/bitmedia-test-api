const Transaction = require('../models/Transaction')

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
    // console.log('Block ' + transactions[0].blockNumber + ' inserted')
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = { createTransactions }
