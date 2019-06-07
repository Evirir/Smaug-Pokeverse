const mongoose = require('mongoose');

const pokeverseRaiderSchema = mongoose.Schema({
    channelID: String,
    hasRaider: Boolean,
    activeUserID: String,
    spawnedBy: String,

    hasRare: Boolean
});

module.exports = mongoose.model("PokeverseRaider", pokeverseRaiderSchema);
