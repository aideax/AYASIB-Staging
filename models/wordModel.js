const mongoose = require('mongoose')

let wordSchema = new mongoose.Schema({
    partOfSpeech: {type: String, default:' '},
    bisayaWord: String,
    englishWord: String,
    bisayaMeaning: String,
    englishMeaning: {type: String, default:' '},
    tags: [{type: String}],
    contributor: String
    
})

module.exports = mongoose.model('Word', wordSchema);




