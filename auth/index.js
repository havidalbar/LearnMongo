const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../db/connection')

const users = db.get('user')
users.createIndex('username', {
  unique: true
})

router.get('/', (req, res) => {
  res.status(200).json({
    message: "Auth Page"
  })
})

router.post('/login', async (req, res, next) => {
  const user = await users.findOne({
    username: req.body.username
  })
  if (user) {
    const check = await bcrypt.compare(req.body.password, user.password)
    if (check) {
      const payload = {
        id: user._id
      }
      const resultJWT = await jwt.sign(payload, process.env.TOKEN_SECRET, (err, token) => {
        if (err) {
          const error = new Error('JWT sign false')
          next(error)
        } else {
          res.status(200).json({
            message: "Login Successfully",
            token,
            data: user
          })
        }
      })
    } else {
      const error = new Error('Username or password is incorrect')
      res.status(401)
      next(error)
    }
  } else {
    const error = new Error('Username not found!')
    res.status(401)
    next(error)
  }
})

router.post('/register', (req, res, next) => {
  users.findOne({
    username: req.body.username
  }).then(user => {
    if (user) {
      const error = new Error('Username already available!')
      error.status(409)
      next(error)
    } else {
      bcrypt.hash(req.body.password, 12, (err, hash) => {
        if (err) {
          const error = new Error('Bcrypt Error')
          next(error)
        } else {
          const user = {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hash,
            birthDate: new Date(req.body.birthDate).toISOString().slice(0,10),
            gender: (req.body.gender) ? "Man" : "Woman"
          }
          users.insert(user).then(results => {
            console.log('Inserted:', user)
            res.status(201).json({
              message: "Register Successfully",
              users: user
            })
          }).catch(err => {
            console.log('Error: ', err)
            const error = new Error('Register Failed ', err)
            next(error)
          })
        }
      })
    }
  }).catch(err => {
    console.log(err)
    const error = new Error('Can\'t find specific user')
    next(error)
  })
})

module.exports = router