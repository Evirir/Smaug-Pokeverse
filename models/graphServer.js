const mongoose = require('mongoose');

const graphServerSchema = mongoose.Schema({
    serverID: String,
    graph: Object,
});

module.exports = mongoose.model("GraphServer", graphServerSchema);
