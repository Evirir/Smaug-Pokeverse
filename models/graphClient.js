

const graphClientSchema = mongoose.Schema({
    totalGraphers: Number
});

module.exports = mongoose.model("GraphClient", graphClientSchema);
