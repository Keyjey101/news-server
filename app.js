require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const router = require('./routes/index')
const PORT = process.env.PORT || 5000
const errorHandler = require('./handlers/ErrorHandler')
const cookieParser = require('cookie-parser')



const app = express()
app.use(express.json({extended: true}))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/api', router)
app.set('view engine', 'ejs');

//lastone
app.use(errorHandler)

const start = async () => {
    try {
        console.log('start command... trying to connect on mongoDB')
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => console.log('connection to mongoDB is open')).catch((e) => console.log('this is error on connection to mongoDB', e))

        app.get('*', (req,res) => res.redirect('/api/news'))
        app.listen(PORT, () => console.log(`server stareded on ${PORT}`))

    }
    catch(e) {
        console.log(e)
    }
}
start()