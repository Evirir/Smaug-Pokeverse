const mongoose = require('mongoose');

const someSchema = mongoose.Schema({
    userid: String,
    money: Number
});

module.exports = mongoose.model("SchemaName", someSchema);
