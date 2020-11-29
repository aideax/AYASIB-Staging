const mongoose = require('mongoose');
const { deserializeUser } = require('passport');

let ratingSchema = new mongoose.Schema({
    rating: {
        type: Number,
        default: 0
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    commentID: String,
    userID: String

    
})


module.exports = mongoose.model('Rating', ratingSchema);




