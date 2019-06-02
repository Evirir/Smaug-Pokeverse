

const serverSettingsSchema = mongoose.Schema({
    serverID: String,
    prefix: String,
    owo: Boolean,
});

module.exports = mongoose.model("serverSettings", serverSettingsSchema);
