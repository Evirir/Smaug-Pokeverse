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

const userProfileSchema = mongoose.Schema({
    userID: String,
    money: Number,
    energy: Number,
    hp: Number,
    kills: Number,
    deaths: Number,
    inventory: [Object]
});

const gameGraphSchema = mongoose.Schema({
    channelID: String,
    nodeCount: Number,
    phase: Number,

    adj: [[edgeSchema]],
    userLocations: [userLocationSchema],
    nodeUsers: [nodeUserSchema],
    userProfiles: [userProfileSchema]
});

module.exports = mongoose.model("GameGraph", gameGraphSchema);
