// Server setup
const express = require('express')
const app = express()
const api = require('./server/routes/api')
const dbdata = require('./expenses')
const bodyParser=require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// Mongoose setup
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/', { useNewUrlParser: true })

app.use('/', api)

const port = 4200
app.listen(port, function () {
    console.log(`Running on port ${port}`)
})
