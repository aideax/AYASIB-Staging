const express = require('express')
const router = express.Router()
const Question = require('../models/questionModel')
const User = require('../models/userModel')
const Contribution = require('../models/contributionsModel')
const {isLoggedIn} = require('../middleware')
const {isAdmin} = require('../middleware')
const { find, findByIdAndUpdate } = require('../models/questionModel')
const async = require('async')

router.get('/', isLoggedIn, (req, res) => {
    res.render('contribute')
})

router.post('/', isLoggedIn, async (req, res) => {
    try{
        let contribution = {
            bisayaPhrase: req.body.bisayaPhrase,
            englishPhrase: req.body.englishPhrase,
            bisayaMeaning: req.body.bisayaMeaning,
            englishMeaning: req.body.englishMeaning
        }
        let user = await User.findById(req.user.id)
        contribution.contributor = user
        let newContribution = await Contribution.create(contribution)
        user.contributions.push(newContribution)
        user.save()
        res.redirect('../contribute/success')
    } catch(e){
        console.log('error')
        req.flash('error', 'Something went wrong with the submission')
        res.redirect('/')
    }
    
})

router.get('/success', isLoggedIn, (req, res) => {
    res.render('contributeSuccess')
})



router.get('/review', isLoggedIn, isAdmin, async (req, res) => {
    let contributions = await Contribution.find({}).populate('contributor')
    
  
    const page = 1
    const limit = 10
    const startIndex = 1
    const endIndex = page * limit
    let results = {}
   
    results.results = contributions.slice(startIndex, endIndex)
    results.total = contributions.length
    results.pages = Math.ceil(contributions.length / limit)
    res.render('review', {contributions: results.results})

})
router.delete('/:reviewID', isLoggedIn, isAdmin, async (req, res) => {
    try{
        let contribution = await Contribution.findByIdAndDelete(req.params.reviewID)
        
        req.flash('info', 'Contribution has been deleted')
    } catch(e){
        req.flash('error', e.message)
    }
    res.redirect('../contribute/review')
})

router.delete('/:reviewID/success', isLoggedIn, isAdmin, async (req, res) => {
    try{
        let contribution = await Contribution.findByIdAndDelete(req.params.reviewID)
        
        req.flash('info', 'Contribution has been deleted')
    } catch(e){
        req.flash('error', e.message)
    }
    res.send('okay')
})


router.get('/:reviewID', isLoggedIn, isAdmin, async (req, res) => {
    let contributions = await Contribution.findById(req.params.reviewID).populate('contributor')
    res.send(contributions)
})

router.post('/:reviewID', async (req, res) => {
    
    res.redirect('success')
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