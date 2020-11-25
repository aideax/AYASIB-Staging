const mongoose = require('mongoose');
const { deserializeUser } = require('passport');
const { schema } = require('./questionModel');

let commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    replies: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply'
    },
    raters:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: Number
    
})


module.exports = mongoose.model('Comment', commentSchema);




