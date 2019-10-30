const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExpenseSchema = new Schema({
    name: String ,
    amount: Number,
    date: Date,
    group:String
})

const Expense = mongoose.model("Expense", ExpenseSchema)
module.exports = Expense
