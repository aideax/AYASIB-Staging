const express = require('express')
const router = express.Router()
const Question = require('../models/questionModel')




router.get('/', (req, res) => {
    res.render('allLessons')
})

router.get('/add', (req, res) => {
    res.render('addPhrase')
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



router.post('/add', async (req, res) => {
    let question = req.body.phrase
    await Question.create(question, (err, newQuestion) => {
        if(err){
            console.log(err)
        }
        console.log('You entered this to the database', newQuestion)
    })

    res.send('You entered something')
})
module.exports = router