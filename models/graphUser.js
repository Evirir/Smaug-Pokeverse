const mongoose = require('mongoose');

const graphUserSchema = mongoose.Schema({
    userID: String,
    graphID: Number,
    node: Number,
    energy: Number
});

module.exports = mongoose.model("GraphUser", graphUserSchema);
