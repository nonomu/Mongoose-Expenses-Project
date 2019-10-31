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
            console.log("We have a " + count + " EXpenses");
        })
    })
    res.end()
})

router.put('/update', function (req, res) {
    Expense.findOneAndUpdate
        (
            { group: `${req.body.group1}` },
            { $set: { group: `${req.body.group2}` } },
            { new: true }
        )
        .exec(function (err, expense) {
            res.send(expense._id + " changed to " + expense.group);
        })

})
router.get('/expenses/:group', function (req, res) {
    let d1 = req.query.d1 ? moment(req.query.d1).format("LLLL") : moment().format("LLLL")
    let d2 = req.query.d2 ? moment(req.query.d2).format("LLLL") : moment().format("LLLL")

    if (req.query.total == "true") {
        Expense.aggregate
            (
                [
                    { $match: { group: `${req.params.group}` } },
                    { $group: { _id: "$group", total: { $sum: "$amount" } } }
                ]
            )
            .exec(function (err, totalAmount) {
                if (err) { res.send(err.errmsg) }
                if (!totalAmount.length) { return res.send("Empty") }
                let total = totalAmount[0].total
                res.send(total.toString())
            })
    }
    else if(d1) {
        console.log(d1);
        console.log(d2);
        Expense.find({
            $and: [
                { date: { $gte: d1 } },
                { date: { $lte: d2 } }
            ]
        }).exec(function (err, data) {
            res.send(data);
        })
    }
    else {
        Expense.find({ group: `${req.params.group}` }).exec(function (err, expensesByGroup) {
            res.send(expensesByGroup)
        })
    }
})












module.exports = router
