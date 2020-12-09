let mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const uniqueValidator = require('mongoose-unique-validator')

let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    knownWords: [{type: String}],
    knownPhrases: [{
        phrase:{type: String},
        translation:{type: String}
    }],
    accountType: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    ratings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rating'
        }
    ],
    contributions:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contribution'
        }
    ],
    lessonsDone: {
        type: Number,
        default: 0
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);


