const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/userModel')
const {isLoggedIn} = require('../middleware')

router.get('/', isLoggedIn, (req, res) => {
    res.send('You are viewing user')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    try{
        const {username, password} = req.body
        const user = new User({username})
        const registerUser = await User.register(user, password)
        res.redirect('../')
    } catch (e) {
        console.log('Register failed', e)
        res.redirect('register')
    }
})

router.get('/login', async (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', 
    {
        failureRedirect:'/login', 
        failureMessage:'Please enter valid username or password'
    }), 
    async (req, res) => {
    res.redirect('../')
})



module.exports = router