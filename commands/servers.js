module.exports = {
	name: 'servers',
	description: `Shows places (server) where I've gone to!`,
	aliases: [`serverlist`],

	execute(message, args){
   		message.channel.send("Servers:");
   		client.guilds.forEach((guild) => {
	   		message.channel.send(" - " + guild.name);
   		})
 	}
};
