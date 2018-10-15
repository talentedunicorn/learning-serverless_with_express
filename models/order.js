const mongoose = require('mongoose')

const Orders = mongoose.Schema({
  title: String,
  fullname: String,
  quantity: Number,
  email: String,
  address: String,
  billUrl: String,
  service: String
}, { timestamps: true })

const Order = mongoose.models.Order || mongoose.model('Order', Orders)

module.exports = Order
