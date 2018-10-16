// Environment variables
require('dotenv').load()

const connectDB = require('../libs/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs-then')
const User = require('../models/user')

// Register
module.exports.register = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  return connectDB()
    .then(() => register(JSON.parse(event.body)))
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message
    }))
}

// Login
module.exports.login = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  
  return connectDB()
    .then(() => login(JSON.parse(event.body)))
    .then(session => ({
      statusCode: 200,
      headers: {
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 
        'Content-Type' : 'text/plain',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ stack: err.stack, message: err.message })
    }))
}

/**
 *
 * Helpers
 */

function signToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: 86400 // 24hrs
  })
}

function checkIfInputIsInvalid(eventBody) {
  if (!(eventBody.password && 
    eventBody.password.length >= 7)) {
    return Promise.reject(new Error('Password error. Password needs to be longer than 8 characters.'))
  }

  if (!(eventBody.name && 
      eventBody.name.length > 5 &&
    typeof eventBody.name === 'string')) {
    return Promise.reject(new Error('Username error. Username needs to be longer than 5 characters.'))
  }

  if (!(eventBody.email &&
    typeof eventBody.email === 'string')) {
    return Promise.reject(new Error('Email error. Email must have valid characters.'))
  }

  return Promise.resolve()
}

function register(eventBody) {
  return checkIfInputIsInvalid(eventBody)
    .then(() => User.findOne({ email: eventBody.email }) )
    .then(user => 
      user ? Promise.reject(new Error('User with that email exists'))
        : bcrypt.hash(eventBody.password, 8))
      .then(hash => {
        let { name, email } = eventBody
        return User.create({ name, email, password: hash }) 
      })
      .then(user => ({ auth: true, token: signToken(user._id) }))
}

function login(eventBody) {
  return User.findOne({ email: eventBody.email })
    .then(user => 
      !user ? Promise.reject(new Error('User with that email address does not exist')):
      comparePassword(eventBody.password, user.password, user._id))
    .then(token => ({ auth: true, token: token }))
}

function comparePassword(eventPassword, userPassword, userId) {
  return bcrypt.compare(eventPassword, userPassword)
    .then(passwordIsValid => !passwordIsValid ? 
      Promise.reject(new Error('The credentials are incorrect')) :
      signToken(userId))
}
