// Environment variables
require('dotenv').load()

const serverless = require('serverless-http')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const connectDB = require('./libs/db')
const VerifyToken = require('./auth/VerifyToken.js')
const Order = require('./models/order')
const app = express()

// Connect to mongoose
connectDB()

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

app.post('/orders', VerifyToken.auth, function(req, res) {
  const order = Order(req.body)
  order
    .save()
    .then(data => res.status(200).send(data))
    .catch(err => {
      console.log(err)
      res.send('Error occured')
    })
})

app.post('/orders/update/:id', function(req, res) {
  let { URL } = req.body

  Order.findById(req.params.id, function(err, doc) {
    if(err) return res.status(500).json({ error: err })

    doc.billUrl = URL
    doc.save(function(err, doc) {
      if(err) return res.status(500).json({ error: err })
      res.status(200).json({ msg: "Updated successfully", data: doc })
    })
  })
})

app.get('/orders', VerifyToken.auth, function(req, res, next) {
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
