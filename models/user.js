const mongoose = require('mongoose')

const Users = mongoose.Schema({
  name: String,
  email: String,
  password: String
})

const User = mongoose.models.User || mongoose.model('User', Users)

module.exports = User
