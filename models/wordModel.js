const mongoose = require('mongoose')

let wordSchema = new mongoose.Schema({
    partOfSpeech: String,
    bisayaWord: String,
    englishWord: String,
    bisayaMeaning: String,
    englishMeaning: String,
    tags: [{type: String}]
    
})

module.exports = mongoose.model('Word', wordSchema);




