const express = require('express')
const router = express.Router()
const Question = require('../models/questionModel')
const User = require('../models/userModel')
const Word = require('../models/wordModel')
const {isLoggedIn} = require('../middleware')
const {isAdmin} = require('../middleware')
const { find, findByIdAndUpdate } = require('../models/questionModel')


router.get('/', async (req, res) => {
    res.render('dictionary')
    
})

router.get('/add', async (req, res) => {
    res.render('dictionaryAdd')
})

router.post('/add', async (req, res) => {
    let input = req.body
    let word = {
        bisayaWord: req.body.bisayaWord,
        englishWord: req.body.englishWord,
        bisayaMeaning: req.body.bisayaMeaning,
        englishMeaning: req.body.englishMeaning,
        partOfSpeech: req.body.partOfSpeech
    }

    let add = await Word.create(word, (err, newWord) => {
        if(err){
            console.log(err)
        }
    })
    res.redirect('add')
})



module.exports = router