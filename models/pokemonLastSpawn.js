

const pokemonLastSpawnSchema = mongoose.Schema({
    channelID: String,
    lastSpawn: String,
    capturedBy: String,
});

module.exports = mongoose.model("pokemonLastSpawn", pokemonLastSpawnSchema);
