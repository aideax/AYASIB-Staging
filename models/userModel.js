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
    accountType: String
    
    //comments
    //upvotes
    //downvotes
    //contribution
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);


