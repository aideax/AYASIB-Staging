const mongoose = require('mongoose')

let contributionSchema = new mongoose.Schema({
    bisayaPhrase: String,
    englishPhrase: String,
    bisayaMeaning: String,
    englishMeaning: String,
    contributor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateSubmitted: {
        type: Date,
        default: Date.now
    },
    userID: String
})


module.exports = mongoose.model('Contribution', contributionSchema);




