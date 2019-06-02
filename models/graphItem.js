

const graphItemSchema = mongoose.Schema({
    name: String,
    tier: Number,
    price: Number,
    energy: Number,
    description: String,
    function: Object,
    ownedBy: Array
});

module.exports = mongoose.model("GraphItem", graphItemSchema);
