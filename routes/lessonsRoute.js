const express = require('express')
const router = express.Router()
const Question = require('../models/questionModel')
const User = require('../models/userModel')
const Word = require('../models/wordModel')
const {isLoggedIn} = require('../middleware')
const {isAdmin} = require('../middleware')
const { find, findByIdAndUpdate } = require('../models/questionModel')
const async = require('async')
const e = require('express')


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
        lesson: req.body.lesson,
        lessonTitle: req.body.lessonTitle
    }

    
    let add = await Question.create(question, (err, newQuestion) => {
        if(err){
            req.flash('error', err.message)
        }
    })
    res.redirect('add')
})


router.get('/get/asd', async (req, res) => {
    const question = await Question.find({})
    res.json(question)
})


router.get('/get/:lesson', async (req, res) => {
    let lesson = req.params.lesson
    const questions = await Question.find({lesson: lesson})
    console.log(questions)
    if(questions.length < 1){
        res.json('denied')
    } else{
        res.json(questions)
    }
})




router.get('/:lesson', async (req, res) => {
    let lesson = req.params.lesson
    const oneLesson = await Question.findOne({lesson: req.params.lesson})
    if(oneLesson){
        res.render('learn',{data:{lessonTitle: oneLesson.lessonTitle, lesson: req.params.lesson}})
    } else {
        res.redirect('../lessons')
    }
    
})

router.get('/:lesson/done', async (req, res) => {
    let lesson = req.params.lesson
    const questions = await Question.find({lesson: lesson})
    res.send(questions.lessonTitle)
    // res.render('done',{lesson: lesson})
    
})

router.post('/:lesson/done', isLoggedIn, async (req, res) => {
    let input = req.body
    const gotUser = await User.findById(req.user.id)
    for(let x = 0; x < gotUser.knownWords.length; x++){
        for(let i=0; i<input.words.length; i++) {
            if(input.words[i]===gotUser.knownWords[x]){
                input.words.splice(i, 1); 
            } 
        }
    }
    input.words.forEach(element => {
        gotUser.knownWords.push(element)
    })

    console.log('Input',input.phrases)
    console.log('DB', gotUser.knownBisaya)


    for(let x = 0; x < gotUser.knownBisaya.length; x++){
        for(let i=0; i<input.phrases.length; i++) {
            if(input.phrases[i].bisaya === gotUser.knownBisaya[x]){
                input.phrases.splice(i, 1); 
            } 
        }
    }

    input.phrases.forEach(element => {
        gotUser.knownBisaya.push(element.bisaya)
        gotUser.knownEnglish.push(element.english)
    })
    gotUser.lessonsDone += 1
    gotUser.save()
    res.status(202).send()
})

module.exports = router