const Discord = require('discord.js');
const GraphServer = require('../../models/graphServer.js');

module.exports = {
	name: 'players',
	description: `Shows players' locations.`,
    aliases: ['player'],

	async execute(message, args, prefix){
		let graphServer = await GraphServer.findOne({serverID: message.guild.id}).catch(err => console.log(err));
		if(!graphServer) return console.log(`move.js: No graphServer data found.`);

		let list = [];
        graphServer.userLocations.forEach(user => {
            list.push(`Node ${user.node}: ${message.client.users.get(user.id).username}`);
        });

		const embed = new Discord.RichEmbed()
		.setColor(`GOLD`)
		.setTitle(`Player list`)
        .setDescription(list.join('\n'));

		message.channel.send(embed);
	}
};
