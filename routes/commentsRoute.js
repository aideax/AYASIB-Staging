const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/userModel')
const Comment = require('../models/commentsModel')
const Rating = require('../models/ratingsModel')
const Question = require('../models/questionModel')
const {isLoggedIn} = require('../middleware')



router.get('/:question', async (req, res) => {
    const question = await Question.findById(req.params.question).populate('comments')
    res.json(question.comments)

})



router.post('/:question/add', isLoggedIn, async(req, res) => {
    
    const user = await User.findById(req.user.id)
    const comment = new Comment({
        comment: req.body.comment,
        user: user,
        username: user.username
    })
    const question = await Question.findById(req.params.question)
    user.comments.push(comment)
    question.comments.push(comment)
    comment.save()
    question.save()
    user.save()
    res.send(question)
    
})




module.exports = router