const mongoose = require('mongoose');
const { deserializeUser } = require('passport');

let ratingSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    
})


module.exports = mongoose.model('Rating', ratingSchema);




