const Discord = require('discord.js');
const {cute} = require('../imageLinks.json');

module.exports = {
	name: 'cute',
	description: `Summons a random cute dragon. Add number for specific cute dragon.`,
	aliases: [`cutedragon`,`kawaii`,`cutederg`,`cutedrag`],
	usage: `[id]`,

	execute(message,args){
        let id = 0;
        const maxID = cute.length;

		if (!args.length)	id = Math.floor(Math.random() * maxID) + 1;
        else 				id = args[0];

		if(isNaN(id))
			return message.channel.send(`ID is not a number! Please input an ID between 1 and ${maxID}.`);
        if(id > maxID || id < 1)
            return message.channel.send(`ID out of range! Please input an ID between 1 and ${maxID}.`);

		const embed = new Discord.RichEmbed()
			.setTitle(`Cute dragon #${id}`)
            .setImage(cute[id - 1]);

		message.channel.send(embed);
	}
}
