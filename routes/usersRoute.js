const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/userModel')
const {
    isLoggedIn
} = require('../middleware')
const {
    Router
} = require('express')

router.get('/', isLoggedIn, (req, res) => {
    res.send('You are viewing user')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body
        const user = new User({
            username
        })
        const registerUser = await User.register(user, password)
        req.flash('success', 'Welcome to AYASIB!')
        res.redirect('../')
    } catch (e) {
        req.flash('error', e.failureMessage)
        res.redirect('register')
    }
})

router.get('/login', async (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        failureMessage: 'Please enter valid username or password'
    }),
    async (req, res) => {
        req.flash('loginError', 'Username and password does not match')
        res.redirect('../')
    })

router.post('/login/quick', passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login',
        failureMessage: 'Please enter valid username or password'
    }),
    async (req, res) => {
        res.status(200)
    })



module.exports = router