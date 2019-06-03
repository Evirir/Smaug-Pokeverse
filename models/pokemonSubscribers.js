const mongoose = require('mongoose');

const pokemonSubscribersSchema = mongoose.Schema({
    subs: [String]
});

module.exports = mongoose.model("pokemonSubscribers", pokemonSubscribersSchema);
