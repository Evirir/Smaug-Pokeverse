const mongoose = require('mongoose');

const graphItemSchema = mongoose.Schema({
    name: String,
    price: Number,
    energy: Number,
    function: Object
});

module.exports = mongoose.model("GraphItem", graphItemSchema);
