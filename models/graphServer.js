const mongoose = require('mongoose');

const graphServerSchema = mongoose.Schema({
    serverID: String,
    nodeCount: Number,

    adj: {
        type: Map,
        of: Array
    },
    
    graphUsers: {
        type: Map,
        of: Number
    },

    nodeUsers: {
        type: Map,
        of: Array
    }
});

module.exports = mongoose.model("GraphServer", graphServerSchema);
