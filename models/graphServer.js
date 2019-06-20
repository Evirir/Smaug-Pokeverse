const mongoose = require('mongoose');

const edgeSchema = mongoose.Schema({
    v: Number,
    w: Number
});

const userLocationSchema = mongoose.Schema({
    id: String,
    node: Number
});

const nodeUserSchema = mongoose.Schema({
    node: Number,
    users: [String]
});

const graphServerSchema = mongoose.Schema({
    serverID: String,
    nodeCount: Number,

    adj: [[edgeSchema]],

    userLocations: [userLocationSchema],

    nodeUsers: [nodeUserSchema]
});

module.exports = mongoose.model("GraphServer", graphServerSchema);
