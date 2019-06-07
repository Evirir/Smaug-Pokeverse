const mongoose = require('mongoose');

const serverSettingsSchema = mongoose.Schema({
    serverID: String,
    prefix: String
});

module.exports = mongoose.model("serverSettings", serverSettingsSchema);
