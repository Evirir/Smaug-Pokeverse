const mongoose = require('mongoose');

const graphUserSchema = mongoose.Schema({
    userID: String,
    node: Number,
    energy: Number
});

module.exports = mongoose.model("GraphUser", graphUserSchema);
