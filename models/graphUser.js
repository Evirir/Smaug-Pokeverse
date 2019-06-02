const mongoose = require('mongoose');

const graphUserSchema = mongoose.Schema({
    userID: String,
    graphID: Number,
    node: Number,
    energy: Number,
    money: Number,
    type: String,
    kills: Number,
    deaths: Number,
    nextDaily: Date,
    inventory: Array
});

module.exports = mongoose.model("GraphUser", graphUserSchema);
