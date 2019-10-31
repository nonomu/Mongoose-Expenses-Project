const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')
const Expense = require('../models/Expense')




router.get('/expenses', function (req, res) {
    Expense.find({}).sort({ "date": 1 }).exec(function (err, expenses) {
        res.send(expenses)
    })
})
router.post('/new', function (req, res) {

    let PostObj = {
        name: req.body.name,
        amount: req.body.amount,
        date: (req.body.date) ? moment(req.body.date).format("LLLL") : moment(new Date()).format("LLLL"),
        group: req.body.group
    }
    const newExpense = new Expense(PostObj)
    newExpense.save().then(function () {
        Expense.count({}).exec(function (err, count) {
            console.log("We have a " + count + " EXpenses");})
        })
    res.end()
})

router.put('/update', function (req, res) {
    Expense.findOneAndUpdate(
        {group : `${req.body.group1}`},
        { $set: { group:  `${req.body.group2}` } } ,
        {new :true}   
    ).exec(function (err, expense) {
        res.send(expense._id + " changed to " +expense.group);
    })
    
})

module.exports = router
