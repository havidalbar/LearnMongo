const express = require('express')
const jwt = require('jsonwebtoken')
const auth = require('./auth/index')
const middlewareAuth = require('./auth/middleware')
const user = require('./api/user')
const note = require('./api/note')

require('dotenv').config()
const app = express()
const PORT = 5000

app.use(express.json())
app.use(middlewareAuth.checkToken)
app.use('/auth', auth)
app.use('/user', middlewareAuth.validateLogin, user)
app.use('/note', middlewareAuth.validateLogin, note)
app.get('/', (req, res, next) => {
  res.status(200).json({
    message: "Get home successfully"
  })
})

app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message
    }
  })
})

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`))