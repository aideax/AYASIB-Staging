let mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let userSchema = mongoose.Schema({
    username: {
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
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);


