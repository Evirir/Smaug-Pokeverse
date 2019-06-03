const mongoose = require('mongoose');

const graphServerSchema = mongoose.Schema({
    serverID: String,
    nodeCount: Number,

    adj: Array,

    graphUsers: {
        type: Map,
        of: Number
    },

    nodeUsers: Array
});

module.exports = mongoose.model("GraphServer", graphServerSchema);
