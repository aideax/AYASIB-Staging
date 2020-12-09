const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/userModel')
const Comment = require('../models/commentsModel')
const Rating = require('../models/ratingsModel')
const Question = require('../models/questionModel')
const {isLoggedIn} = require('../middleware')
const { resolveInclude } = require('ejs')
const async = require('async')

router.post('/upvote/:commentid', async (req, res) => {
  

  
  let user = await User.findById(`5fb988c83ee83f5c2c672ea3`)
  let comment = await Comment.findById(req.params.commentid).populate('raters')

  let rating = await Rating.create({
    rating: 1,
    comment: comment,
    user: user,
    commentID: comment._id,
    userID: user._id
  })
  comment.raters.push(user)
  comment.ratings.push(rating)
  comment.rating += 1
  user.ratings.push(rating)
  let back = {
    user: user,
    comment: comment,
    rating: rating
  }
  res.send(back)
  
  

  

})

router.get('/downvote/:commentid', async (req, res) => {
    
})
module.exports = router