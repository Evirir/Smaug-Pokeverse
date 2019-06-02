const mongoose = require('mongoose');

const graphServerSchema = mongoose.Schema({
    serverID: String,
    nodeCount: Number,
    adj: Array
});

module.exports = mongoose.model("GraphServer", graphServerSchema);
