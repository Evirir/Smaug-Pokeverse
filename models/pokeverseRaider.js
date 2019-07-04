const mongoose = require('mongoose');

const pokeverseRaiderSchema = mongoose.Schema({
    channelID: String,
    status: String,   //(undefined), raider, rare, megaboss
    activeUserID: String,
    spawnedBy: String,
    
    hasRare: Boolean,
    hasRaider: Boolean
});

module.exports = mongoose.model("PokeverseRaider", pokeverseRaiderSchema);
