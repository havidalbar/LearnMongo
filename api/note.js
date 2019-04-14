const express = require('express')
const router = express.Router()
const db = require('../db/connection')
const note = db.get('note')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
    id = getId(req)
    await note.find({ creatorId: id }).then(result => {
        res.json(result)
    })
})

router.post('/post', (req, res) => {
    const body =
    {
        title: req.body.title,
        body: req.body.body,
        creatorId: getId(req),
        createdAt: new Date(),
        updatedAt: new Date()
    }
    note.insert(body)
    res.json({
        message: "Post Success"
    })
})

router.put('/update:id', async (req, res)=>{
    const before = await note.findOne({_id: req.params.id})
    const body =
    {
        title: req.body.title,
        body: req.body.body,
        creatorId: before.creatorId,
        createdAt: before.createdAt,
        updatedAt: new Date()
    }
    note.update({_id: req.params.id}, body)
    res.json({
        message: "Update Success"
    })
})

router.delete('/delete:id', (req,res,next)=>{
    note.remove({_id: req.params.id})
    res.json({
        message: "Delete Success"
    })
})
function getId(req) {
    const authHeader = req.get('Authorization')
    const token = authHeader
    return jwt.decode(token).id
}
module.exports = router