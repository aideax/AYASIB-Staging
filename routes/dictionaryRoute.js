const express = require('express')
const router = express.Router()
const async = require('async')
const Question = require('../models/questionModel')
const User = require('../models/userModel')
const Word = require('../models/wordModel')
const {
    isLoggedIn
} = require('../middleware')
const {
    isAdmin
} = require('../middleware')
const {
    find,
    findByIdAndUpdate
} = require('../models/questionModel')
const {
    json
} = require('express')
const e = require('express')


router.get('/', async (req, res) => {
    res.render('dictionary')

})

router.get('/add', async (req, res) => {
    res.render('dictionaryAdd')
})

router.post('/add', isAdmin, async (req, res) => {
    let input = req.body
    let word = {
        bisayaWord: req.body.bisayaWord,
        englishWord: req.body.englishWord,
        bisayaMeaning: req.body.bisayaMeaning,
        englishMeaning: req.body.englishMeaning,
        partOfSpeech: req.body.partOfSpeech
    }
    try {
        let add = await Word.create(word)
        req.flash('success', `Added ${add.bisayaWord} to the dictionary`)
    } catch (e) {
        req.flash('error', e.message)
    }

    res.redirect('add')
})

router.get('/search/:word/:page', async (req, res) => {
    let word = req.params.word.charAt(0).toUpperCase() + req.params.word.slice(1)
    // let query = await Word.find({bisayaWord: {$regex : `.*${word}.*`}})
    let query = await Word.find({ $or: [{bisayaWord: {$regex : `.*${word}.*`}}, {englishWord: {$regex:`.*${word}.*`}}]})
    
    

  
    const page = parseInt(req.params.page)
    const limit = 10
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    let results = {}
    if (endIndex < query.length)
        results.next = {
            page: page + 1,
            limit: limit
        }
    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }
    results.results = query.slice(startIndex, endIndex)
    results.total = query.length
    results.pages = Math.ceil(query.length / limit)
    res.send(results)

})




module.exports = router