const mongoose = require('mongoose');

const graphUserSchema = mongoose.Schema({
    userID: String,
    joined: Number,
    money: Number,
    energy: Number,
    type: String,
    kills: Number,
    deaths: Number,
    nextDaily: Date,
    inventory: Array
});

module.exports = mongoose.model("GraphUser", graphUserSchema);
