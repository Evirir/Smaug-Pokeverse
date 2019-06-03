const mongoose = require('mongoose');

const graphServerSchema = mongoose.Schema({
    serverID: String,
    nodeCount: Number,

    adj: [[Number, Number]],

    graphUsers: {
        type: Map,
        of: Number
    },

    nodeUsers: [[String]]
});

module.exports = mongoose.model("GraphServer", graphServerSchema);
