

const wishlistPokemonSchema = mongoose.Schema({
    name: String,
    wishedBy: Array
});

module.exports = mongoose.model("wishlistPokemon", wishlistPokemonSchema);
