const mongoose = require('mongoose');

const graphItemSchema = mongoose.Schema({
    name: String,
    tier: Number,
    price: Number,
    energy: Number,
    description: String,
    function: Object
});

module.exports = mongoose.model("GraphItem", graphItemSchema);
