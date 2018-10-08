// Environment variables
require('dotenv').load()

const serverless = require('serverless-http')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const Order = require('./models/order')
const app = express()

// Connect to mongoose
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log('Connected to mongodb'))
  .catch(err => console.log(err))

// Add CORS
app.use(cors())

// Response CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// Set body parse for json
app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.json({
    body: 'Welcome to the serverless experience'
  })
})

app.get('/greet/:name', function(req, res) {
  res.status(200).json({ body: 'Hello, ' + req.params.name })
})

app.post('/orders', function(req, res) {
  let { title, fullname, amount, email, address } = req.body
  const order = Order({
    title,
    fullname,
    amount,
    email,
    address
  })

  order
    .save()
    .then(data => res.status(200).send(data))
    .catch(err => {
      console.log(err)
      res.send('Error occured')
    })
})

app.get('/orders', function(req, res) {
  Order.find({})
    .then(data => {
      res.status(200).send(data)
    })
    .catch(err => res.send('Something went wrong'))
})

// Handle invalid routes
app.get('*', function(req, res) {
  res.status(404).json({
    error: "The route you are trying to visit IS DEAD!"
  })
})
module.exports.handler = serverless(app)
