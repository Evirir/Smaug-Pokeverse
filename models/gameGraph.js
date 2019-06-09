const mongoose = require('mongoose');

const edgeSchema = mongoose.Schema({
    v: Number,
    w: Number
});

const userLocationSchema = mongoose.Schema({
    userID: String,
    node: Number
});

const gameGraphSchema = mongoose.Schema({
    serverID: String,
    nodeCount: Number,

    adj: [[edgeSchema]],

    userLocations: [userLocationSchema],

    nodeUsers: [[String]]
});

module.exports = mongoose.model("GameGraph", gameGraphSchema);
