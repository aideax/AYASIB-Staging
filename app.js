const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { allowedNodeEnvironmentFlags } = require('process')
const PORT = process.env.PORT || 5500
require('dotenv/config')


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())


mongoose.connect(process.env.DB_CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('Connected to Mongo Atlas');
}).catch(err => {
    console.log('ERROR', err.message);
});


//IMPORT ROUTES AND MODELS
const lessonsRoute = require('./routes/lessonsRoute')
app.use('/lessons', lessonsRoute)



app.get('*', (req, res) => {
    res.send('<h1> WELCOME TO AYASIB </h1>')
})










app.listen(PORT, () => {
    console.log('AYASIB Started')
})