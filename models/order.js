const mongoose = require('mongoose')

const Orders = mongoose.Schema({
  title: String,
  fullname: String,
  amount: Number,
  email: String,
  address: String
})

const Order = mongoose.models.Order || mongoose.model('Order', Orders)

module.exports = Order
