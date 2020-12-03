const express = require('express')
const router = express.Router()
const Question = require('../models/questionModel')
const User = require('../models/userModel')
const Word = require('../models/wordModel')
const {isLoggedIn} = require('../middleware')
const {isAdmin} = require('../middleware')
const { find, findByIdAndUpdate } = require('../models/questionModel')



router.get('/', (req, res) => {
    res.render('allLessons')
})

router.get('/add', isLoggedIn, isAdmin, (req, res) => {
    res.render('addLesson')
})

router.post('/add', isLoggedIn, isAdmin, async (req, res) => {
    
    let input = req.body
    let splitBisaya =  input.phrase.split(" ")
    let splitEnglish = input.translation.split(" ")
    let question = {
        phrase: input.phrase,
        translation: input.translation,
        bisayaWords: splitBisaya,
        englishWords: splitEnglish,
        lesson: req.body.lesson
    }

    
    let add = await Question.create(question, (err, newQuestion) => {
        if(err){
            console.log(err)
        }
    })
    res.redirect('add')
})


router.get('/get/asd', async (req, res) => {
    const question = await Question.find({})
    res.json(question)
})


router.get('/get/:lesson', async (req, res) => {
    console.log('getting lesson')
    let lesson = req.params.lesson
    const questions = await Question.find({lesson: lesson})
    console.log("questions length", questions.length)
    if(questions.length < 1){
        console.log('not sending json')
        res.json('denied')
    } else{
        console.log('sending json')
        res.json(questions)
    }
})




router.get('/:lesson', async (req, res) => {
    let lesson = req.params.lesson
    res.render('learn',{lesson: lesson})
    
})

router.get('/:lesson/done', async (req, res) => {
    let lesson = req.params.lesson
    res.render('done',{lesson: lesson})
    
})

router.post('/:lesson/done', async (req, res) => {
    let input = req.body
    console.log(input)
    const gotUser = await User.findById(req.user.id)

    for(let x = 0; x < gotUser.knownWords.length; x++){
        for(let i=0; i<input.words.length; i++) {
            if(input.words[i]===gotUser.knownWords[x]){
                console.log('You are splicing', input.words[i])
                input.words.splice(i, 1); 
            } 
        }
    }
    input.words.forEach(element => {
        gotUser.knownWords.push(element)
    })

    for(let x = 0; x < gotUser.knownPhrases.length; x++){
        for(let i=0; i<input.phrases.length; i++) {
            if(input.phrases[i].bisaya===gotUser.knownPhrases[x].phrase){
                console.log('You are splicing', input.phrases[i])
                input.phrases.splice(i, 1); 
            } 
        }
    }
    input.words.forEach(element => {
        gotUser.knownWords.push(element)
    })
    gotUser.save()
    res.status(202).send()
})

module.exports = router