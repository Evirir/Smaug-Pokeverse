const Discord = require('discord.js');
const Raider = require('../../models/pokeverseRaider.js');

module.exports = {
	name: `test`,
	description: `Test new features.`,
	dev: true,

	async execute(message, args){
		let raiders = await Raider.find({});
		raiders.forEach(async raider => {
			raider.hasRaider = undefined;
			raider.hasRare = undefined;

			await raider.save().catch(err => console.log(err));
		});

		message.channel.send(`Database updated.`);
	}
}
