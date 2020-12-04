const express = require('express')
const router = express.Router()
const Question = require('../models/questionModel')
const User = require('../models/userModel')
const Word = require('../models/wordModel')
const {isLoggedIn} = require('../middleware')
const {isAdmin} = require('../middleware')



router.get




module.exports = router