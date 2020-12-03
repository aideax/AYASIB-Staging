const express = require('express')
const router = express.Router()
const Question = require('../models/questionModel')
const User = require('../models/userModel')
const Contribution = require('../models/contributionsModel')
const {isLoggedIn} = require('../middleware')
const {isAdmin} = require('../middleware')
const { find, findByIdAndUpdate } = require('../models/questionModel')


router.get('/', (req, res) => {
    res.render('contribute')
})

router.post('/', async (req, res) => {
    try{
        let contribution = splitWords(req.body.bisayaPhrase, req.body.englishPhrase, req.body.lesson)
        let user = await User.findById('5fb988c83ee83f5c2c672ea3')
        contribution.contributor = user
        let newContribution = await Contribution.create(contribution)
        user.contributions.push(newContribution)
        user.save()
        res.render('contributeSuccess')
    } catch(e){
        req.flash('error', 'Something went wrong with the submission')
        res.redirect('/')
    }
    
})


router.get('/review', async (req, res) => {
    let contributions = await Contribution.find({}).populate('contributor')
    res.render('review', {contributions: contributions})
})




let splitWords = (bPhrase, ePhrase, lesson) => {
    let splitBisaya = bPhrase.split(" ")
    let splitEnglish = ePhrase.split(" ")
    return {
        bisayaPhrase: bPhrase,
        englishPhrase: ePhrase,
        bisayaWords: splitBisaya,
        englishWords: splitEnglish,
        lesson: lesson
    }
}

module.exports = router