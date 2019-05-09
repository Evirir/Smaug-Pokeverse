let prefix = ",,";
const p = await Prefix.findOne({serverID: message.guild.id}).catch(err => console.log(err));
if(!p) return console.log(`No prefix found: triggers.js`);
else prefix = p.prefix;
