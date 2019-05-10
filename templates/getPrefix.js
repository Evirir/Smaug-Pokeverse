let prefix = ",,";
const p = await Settings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
if(!p) return console.log(`No prefix found: commandName.js`);
else prefix = p.prefix;
