

const pokeverseRaiderSettingsSchema = mongoose.Schema({
    serverID: String,
    raiderLockEnabled: Boolean,
    lockRoles: Array,
});

module.exports = mongoose.model("pokeverseRaiderSettings", pokeverseRaiderSettingsSchema);
