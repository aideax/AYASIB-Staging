const express = require('express')
const router = express.Router()
const Question = require('../models/questionModel')
const {isLoggedIn} = require('../middleware')



router.get('/', (req, res) => {
    res.render('allLessons')
})

router.get('/add', isLoggedIn, (req, res) => {
    res.render('addLesson')
})

router.post('/add', isLoggedIn, async (req, res) => {
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
        console.log('You entered this to the database', newQuestion)
    })
    console.log('Entered lesson to the database', add)
    res.redirect('add')
})


router.get('/asd', async (req, res) => {
    const questions = await Question.find({})
    console.log(questions)
    res.json(questions)
})

router.get('/:lesson', async (req, res) => {
    let lesson = req.params.lesson
    res.render('learn',{lesson: lesson})
    
    
    
})

router.get('/get/:lesson', async (req, res) => {
    let lesson = req.params.lesson
    await Question.find({"lesson": `${lesson}`}, (err, newLesson) => {
        if(err){
            console.log(err)
        }
        if(newLesson < 1){
            res.send('denied')
        } else{
            res.send(newLesson)
        }
        
    })
})



module.exports = router