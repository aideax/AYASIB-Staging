const mongoose = require('mongoose')

let contributionSchema = new mongoose.Schema({
    bisayaPhrase: String,
    englishPhrase: String,
    bisayaWords: [{type: String}],
    englishWords:[{type: String}],
    contributor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateSubmitted: {
        type: Date,
        default: Date.now
    },
    lesson: String,
    userID: String
})


module.exports = mongoose.model('Contribution', contributionSchema);




