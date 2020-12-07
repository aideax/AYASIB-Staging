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

router.get('/buffer', (req, res) => {
    req.flash('success', 'Welcome to AYASIB!')
    res.redirect('login')
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
        res.redirect('buffer')
    } catch (e) {
        console.log(e.message)
        req.flash('error', e)
        res.redirect('register')
    }
})

router.get('/login', async (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/user/login',
        failureMessage: 'Please enter valid username or password'
    }),
    async (req, res) => {
        req.flash('success', `Welcome back to ayasib!`)
        res.redirect('../lessons/')
    })


router.post('/login/quick', passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login',
        failureMessage: 'Please enter valid username or password'
    }),
    async (req, res) => {
        res.status(200)
    })


router.get('/profile', isLoggedIn, async (req, res) => {
    let user = await User.findById(req.user.id)
    console.log("User", user)
    res.render('profile', {user: user})
})
module.exports = router