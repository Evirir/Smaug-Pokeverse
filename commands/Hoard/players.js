const Discord = require('discord.js');
const GraphServer = require('../../models/graphServer.js');

module.exports = {
	name: 'players',
	description: `Shows players' locations.`,
    aliases: ['pl','player','play'],

	async execute(message, args, prefix){
		let graphServer = await GraphServer.findOne({serverID: message.guild.id}).catch(err => console.log(err));
		if(!graphServer) return console.log(`move.js: No graphServer data found.`);

		let list = "";
        graphServer.graphUsers.keys().forEach(key => {
            const node = graphServer.graphUsers.get(key);
            list += `${message.client.users.get(key).username}: Node ${node}\n`;
        });

		const embed = new Discord.RichEmbed()
		.setColor(`GOLD`)
		.setTitle(`Player list`)
        .setDescription(list);

		message.channel.send(embed);
	}
};
