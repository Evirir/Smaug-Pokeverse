const mongoose = require('mongoose');

const edgeSchema = mongoose.Schema({
    v: Number,
    w: Number
});

const gameGraphSchema = mongoose.Schema({
    serverID: String,
    nodeCount: Number,

    adj: [[edgeSchema]],

    graphUsers: {
        type: Map,
        of: Number
    },

    nodeUsers: [[String]]
});

module.exports = mongoose.model("GameGraph", gameGraphSchema);
