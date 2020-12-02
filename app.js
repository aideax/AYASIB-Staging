const express = require('express')
const app = express()
const mongoose = require('mongoose')
const flash = require('connect-flash')
const { allowedNodeEnvironmentFlags, nextTick } = require('process')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const PORT = process.env.PORT || 5500
require('dotenv/config')

//IMPORT ROUTES AND MODELS
const User = require('./models/userModel')






app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())





mongoose.connect(process.env.DB_CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connected to Mongo Atlas');
}).catch(err => {
    console.log('ERROR', err.message);
});


app.use(require('express-session')({
    secret: 'This is the secret',
    resave: false,
    saveUninitialized: false,
    cookie:{
        expires: Date.now()+ 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(flash())
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})






const lessonsRoute = require('./routes/lessonsRoute')
const usersRoute = require('./routes/usersRoute')
const commentsRoute = require('./routes/commentsRoute')
const ratingsRoute = require('./routes/ratingsRoute')
const contributionsRoute = require('./routes/contributionsRoute')
const dictionaryRoute = require('./routes/dictionaryRoute')
app.use('/lessons', lessonsRoute)
app.use('/user', usersRoute)
app.use('/comments', commentsRoute)
app.use('/ratings', ratingsRoute)
app.use('/contribute', contributionsRoute)
app.use('/dictionary', dictionaryRoute)
app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/user/login')
})

app.get('/', (req, res) => {

    res.render('allLessons')
})

app.get('*', (req, res) => {
    res.redirect('/')
})


app.listen(PORT, () => {
    console.log('AYASIB Started')
})