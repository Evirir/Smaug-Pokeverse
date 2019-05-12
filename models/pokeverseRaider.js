const mongoose = require('mongoose');

const pokeverseRaiderSchema = mongoose.Schema({
    channelID: String,
    hasRaider: Boolean,
    activeUserID: String
});

module.exports = mongoose.model("PokeverseRaider", pokeverseRaiderSchema);
