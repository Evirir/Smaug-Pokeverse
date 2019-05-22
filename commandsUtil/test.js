const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
	name: `test`,
	description: `Test new features.`,
	dev: true,

	async execute(message, args){
		let sent = await message.channel.send("Test");
		await sent.react('👌');

		const filter = (reaction, user) => {
			return true;
		}
		const collector = await sent.createReactionCollector(filter, { time: 15000 });

		collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
		collector.on('end', collected => console.log(`Collected ${collected.size} items`));
	}
}
