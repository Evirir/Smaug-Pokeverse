const mongoose = require('mongoose');

const moneySchema = mongoose.Schema({
    userID: String,
    money: Number,
    nextDaily: Date,
    inventory: Array
});

module.exports = mongoose.model("Money", moneySchema);
