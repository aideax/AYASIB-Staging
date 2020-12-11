const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/userModel')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const async = require('async')
const {
    isLoggedIn
} = require('../middleware')
const {
    Router
} = require('express')
const contributionsModel = require('../models/contributionsModel')
const { createConnection } = require('net')

router.get('/', isLoggedIn, (req, res) => {
    res.send('You are viewing user')
})


router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    try{
        const {email, username, password} = req.body
        let checkEmail = await User.find({email: email})
        if(checkEmail.length){
            req.flash('error', 'This email is already in use')
            return res.redirect('register')
        }
        const user = new User({email, username})
        const registerUser = await User.register(user, password)
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'You are now registered! Welcome to AYASIB! ' + req.body.username)
            res.redirect('../lessons')
        })
    } catch(e){
        req.flash('error', e.message)
        res.redirect('register')
    }
})


router.get('/login', async (req, res) =>  {
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



router.get('/profile', isLoggedIn, async (req, res) => {
    let user = await User.findById(req.user.id)
    res.render('profile', {
        user: user
    })
})


router.get('/forgot', async (req, res) => {
    res.render('forgot')
    
})

router.post('/forgot', async (req, res) => {
    async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
          User.findOne({ email: req.body.email }, function(err, user) {
            if (!user) {
              req.flash('error', 'No account with that email address exists.');
              return res.redirect('forgot');
            }
    
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 1800000; // 30 mins
    
            user.save(function(err) {
              done(err, token, user);
            });
          });
        },
        function(token, user, done) {
          var smtpTransport = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
              user: 'ayasiblearningapp@gmail.com',
              pass: process.env.GMAILPW
            }
          });
          var mailOptions = {
            to: user.email,
            from: 'ayasiblearningapp@gmail.com',
            subject: 'AYASIB App Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your AYASIB Language Learning App account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' + req.headers.host + '/user/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            console.log('mail sent');
            req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions. You may need to check in your Spam emails');
           
            done(err, 'done');
          });
        }
      ], function(err) {
        if (err){
            req.flash('error', err.message)
            res.redirect('forgot');
        } 
        res.redirect('forgot')
      });
}) 

router.get('/reset/:token', async (req, res) => {

    let user = await User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires:{$gt: Date.now()}})
    if(user){
        res.render('reset', {token: req.params.token})
        
    } else {
      req.flash('error', 'Password reset link is invalid or has expired')
      res.render('forgot')
    }
   
    
    
})

router.post('/reset/:token', async (req, res) => {
    async.waterfall([
        function(done) {
          User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
              req.flash('error', 'Password reset token is invalid or has expired.');
              return res.redirect('forgot');
            }
            if(req.body.password === req.body.confirm) {
              user.setPassword(req.body.password, function(err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
    
                user.save(function(err) {
                  req.logIn(user, function(err) {
                    done(err, user);
                  });
                });
              })
            } else {
                req.flash("error", "Passwords do not match.");
                return res.redirect(`reset/${req.params.token}`);
            }
          });
        },
        function(user, done) {
          var smtpTransport = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
              user: 'ayasiblearningapp@gmail.com',
              pass: process.env.GMAILPW
            }
          });
          var mailOptions = {
            to: user.email,
            from: 'ayasiblearningapp@gmail.com',
            subject: 'Your password has been changed',
            text: 'Hello,\n\n' +
              'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            req.flash('success', 'Success! Your password has been changed.')
            res.redirect('../lessons')
          });
        }
      ], function(err) {
        req.flash('error', err.message)
        res.redirect('../lessons')
      });
})

module.exports = router