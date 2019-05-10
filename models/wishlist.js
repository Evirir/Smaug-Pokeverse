const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({
    userID: String,
    wishlist: Array
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
