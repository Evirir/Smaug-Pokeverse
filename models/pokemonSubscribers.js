

const pokemonSubscribersSchema = mongoose.Schema({
    subs: Array
});

module.exports = mongoose.model("pokemonSubscribers", pokemonSubscribersSchema);
