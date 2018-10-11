// Environment variables
require('dotenv').load()

const mongoose = require('mongoose')

let isConnected
const connectDB = () => {
  if (isConnected) {
    console.log('=> database is already connected.')
    return Promise.resolve() 
  }

  console.log('=> connecting to database...')
  return mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true })
    .then(db => { isConnected = db.connections[0].readyState })
    .catch(err => console.log('Error: ' + err))
}

module.exports = connectDB
