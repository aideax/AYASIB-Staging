const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/userModel')
const Comment = require('../models/commentsModel')
const Rating = require('../models/ratingsModel')
const Question = require('../models/questionModel')
const {isLoggedIn} = require('../middleware')
const { findById } = require('../models/questionModel')


router.get('/devAdd', async (req, res) => {
    // const user = await User.findById(`5fb988c83ee83f5c2c672ea3`)
    // const comment = await Comment.findById('5fc01f5903fa154c104d5bab')
    // comment.raters.push(user)
    // comment.save()
    // res.send(comment)

    const comment = await Comment.findById('5fc01f5903fa154c104d5bab').populate('raters')
    res.send(comment)
})


router.get('/:questionid', isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user.id).populate('ratings')
    const question = await Question.findById(req.params.questionid).populate({path: 'comments', populate:{path: 'raters', model:'User'}})
    let comments = []
    question.comments.forEach(commentElement => {
        let comment = {
            id: commentElement._id,
            username: commentElement.username,
            comment: commentElement.comment,
            userRating: Number
        }
        user.ratings.forEach(ratingElement => {
            if(ratingElement.commentID === commentElement._id){
                console.log('Rating ID === commentID')
                comment.userRating = ratingElement.rating
            }
        });
        comments.push(comment)
    });
    res.json(comments)
})



router.post('/:question/add', isLoggedIn, async(req, res) => {
    
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
    res.send(question)
    
})




module.exports = router