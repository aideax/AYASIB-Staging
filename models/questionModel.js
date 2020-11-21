const mongoose = require('mongoose')

let questionSchema = new mongoose.Schema({
    phrase: String,
    translation: String,
    bisayaWords: [{type: String}],
    englishWords:[{type: String}], 
    lesson: String,
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})


module.exports = mongoose.model('Question', questionSchema);




