const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/userModel')
const Comment = require('../models/commentsModel')
const Rating = require('../models/ratingsModel')
const Question = require('../models/questionModel')
const async = require('async')

const {
    isLoggedIn
} = require('../middleware')
const {
    findById
} = require('../models/questionModel')




router.get('/:questionid', async (req, res) => {
    const question = await Question.findById(req.params.questionid).populate('comments')
    if(!question){
        res.send('no question')
    } else {
        res.send(question)
    }
    
})

router.get('/:questionid/guest', async (req, res) => {
    const question = await Question.findById(req.params.questionid).populate({
        path: 'comments',
        populate: {
            path: 'replies',
            model: 'Comment'
        }
    })
    let comments = []
    question.comments.forEach(commentElement => {
        let comment = {
            id: commentElement._id,
            username: commentElement.username,
            comment: commentElement.comment,
            replies: commentElement.replies,
            userRating: Number
        }
        comments.push(comment)
    })
    res.json(comments)
})



router.post('/:question/add', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        const comment = new Comment({
            comment: req.body.comment,
            user: user,
            username: user.username,
            rating: 0
        })
        const question = await Question.findById(req.params.question)
        user.comments.push(comment)
        question.comments.push(comment)
        comment.save()
        question.save()
        user.save()
        req.flash('success', 'Comment added!')
        res.send(question)
    } catch (e) {
        req.flash('error', e.message)
        res.send(e.message)
    }
})


router.post('/:questionid/reply', async (req, res) => {
    let input = req.body
    const question = Question.findById(req.params.questionid)
    



})



module.exports = router