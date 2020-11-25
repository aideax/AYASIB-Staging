const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/userModel')
const Comment = require('../models/commentsModel')
const Rating = require('../models/ratingsModel')
const Question = require('../models/questionModel')
const {isLoggedIn} = require('../middleware')



router.get('/:question', async (req, res) => {
    const question = await Question.find({_id: req.params.question}).populate('comments')
    console.log(question)
    res.json(question)
})



router.post('/:question/add', isLoggedIn, async(req, res) => {
    const comment = new Comment({
        comment: req.body.comment
    })

    const question = await Question.findById(req.params.question)
    const user = await User.findById(req.user.id)
    comment.user = user
    user.comments.push(comment)
    question.comments.push(comment)
    comment.save()
    question.save()
    user.save()
    console.log(question)
    console.log("you are submitting a comment", req.body.comment)
    res.send(question)
    
})




module.exports = router