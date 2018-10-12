const jwt = require('jsonwebtoken')

// Policy helper
const generatePolicy = (principalId, effect, resource) => {
  let authResponse = {}
  authResponse.principalId = principalId

  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []

    let statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }

  return authResponse
}

module.exports.auth = (req, res, next) => {
  let token = req.headers['x-access-token']

  if(!token) {
    return res.status(403).send({ auth: false, message: 'No token provided' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token' })

    req.userId = decoded.id
    next()
  })
}
