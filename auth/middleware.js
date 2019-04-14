const jwt = require('jsonwebtoken')

function checkToken(req, res, next) {
  const authHeader = req.get('Authorization')
  if (authHeader) {
    const token = authHeader
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, result) => {
        if (err) {
          const error = new Error('JWT Failed')
        } else {
          req.user = result
          next()
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
}

function validateLogin(req, res, next) {
  if (req.user) {
    next()
  } else {
    const error = new Error('Validation error!')
    res.status(403)
    next(error)
  }
}

module.exports = {
  checkToken,
  validateLogin
}