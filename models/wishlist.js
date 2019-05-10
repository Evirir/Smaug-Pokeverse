const mongoose = require('mongoose');

const wishSchema = mongoose.Schema({
    userID: String,
    wishlist: String
});

module.exports = mongoose.model("Wishlist", wishSchema);
