const express = require('express')
const router = express.Router()
const Question = require('../models/questionModel')
const User = require('../models/userModel')
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

router.get('/:lesson/done', isLoggedIn, async (req, res) => {
    let lesson = req.params.lesson
    res.render('done',{lesson: lesson})
    
})

router.post('/:lesson/done', isLoggedIn, async (req, res) => {
    let input = req.body
    let removedWords = []
    const gotUser = await User.findById(req.user.id)
    for(let x = 0; x < gotUser.knownWords.length; x++){
        for(let i=0; i<gotUser.knownWords.length; i++) {
            if(input.words[i]===gotUser.knownWords[x]){
                removedWords.push(input.words[i])
                input.words.splice(i, 1); 
            } 
        }
    }
    input.words.forEach(element => {
        gotUser.knownWords.push(element)
    })

    for(let x = 0; x < gotUser.knownPhrases.length; x++){
        for (let i = 0; i < input.phrases; i++) {
            if(input.phrase[i].bisaya === gotUser.knownPhrases.phrase){
                input.phrase.splice(i, 1)
            }
        }
    }

    input.phrases.forEach(element => {
        gotUser.knownPhrases.push({phrase: `${element.bisaya}`, translation:`${element.english}`})
    })
    gotUser.save()
    res.send('checking user')
})

module.exports = router