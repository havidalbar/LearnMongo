const express = require('express')
const router = express.Router()
const db = require('../db/connection')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


router.get('/', (req, res) => {
  const id = getId(req);
  users.findOne({_id : id}).then(result => {
    res.json(result)
})
})

function getId(req) {
  const authHeader = req.get('Authorization')
  const token = authHeader
  return jwt.decode(token).id
}

module.exports = router