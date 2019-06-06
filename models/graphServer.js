const mongoose = require('mongoose');

const edgeSchema = mongoose.Schema({
    v: Number,
    w: Number
});

/*const nodeSchema = mongoose.Schema({
    id: Number,
    users: [String]
});*/

const graphServerSchema = mongoose.Schema({
    serverID: String,
    nodeCount: Number,

    adj: [[edgeSchema]],

    graphUsers: {
        type: Map,
        of: Number
    },

    nodeUsers: [[String]]
});

module.exports = mongoose.model("GraphServer", graphServerSchema);
