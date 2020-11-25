const mongoose = require('mongoose');
const { deserializeUser } = require('passport');
const { schema } = require('./questionModel');

let replySchema = new mongoose.Schema({
    text: {
        type: String,
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


module.exports = mongoose.model('Reply', replySchema);




