let mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }
    
    //comments
    //upvotes
    //downvotes
    //contribution
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);


