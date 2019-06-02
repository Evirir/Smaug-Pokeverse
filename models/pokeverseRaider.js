

const pokeverseRaiderSchema = mongoose.Schema({
    channelID: String,
    hasRaider: Boolean,
    activeUserID: String,
    spawnedBy: String
});

module.exports = mongoose.model("PokeverseRaider", pokeverseRaiderSchema);
