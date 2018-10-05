const serverless = require('serverless-http')
const express = require('express')
const app = express()

app.get('/', function(req, res) {
  res.send(JSON.stringify({
    body: 'Welcome to the serverless experience'
  }))
})

app.get('/greet/:name', function(req, res) {
  res.status(200).json({ body: 'Hello, ' + req.params.name })
})

// Handle invalid routes
app.get('*', function(req, res) {
  res.status(404).json({
    error: "The route you are trying to visit IS DEAD!"
  })
})
module.exports.handler = serverless(app)
