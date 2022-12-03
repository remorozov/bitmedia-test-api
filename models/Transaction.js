const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    block: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    gas: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

transactionSchema.statics.create = (attrs) => {
  return new Transaction(attrs)
}

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction
