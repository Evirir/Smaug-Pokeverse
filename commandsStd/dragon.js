const Discord = require('discord.js');
const {dragon} = require('../imageLinks.json');

module.exports = {
	name: 'dragon',
	description: `Summons a random dragon. Add number for specific dragon.`,
	aliases: [`dragons`,`derg`,`drag`,`rawr`],
	usage: `[id]`,

	execute(message,args){
        let id = 0;
        const maxID = dragon.length;

		if (!args.length)	id = Math.floor(Math.random() * maxID) + 1;
        else 				id = args[0];

		if(isNaN(id))
			return message.channel.send(`ID is not a number! Please input an ID between 1 and ${maxID}.`);
        if(id > maxID || id < 1)
            return message.channel.send(`ID out of range! Please input an ID between 1 and ${maxID}.`);

		const embed = new Discord.RichEmbed()
			.setTitle(`Dragon #${id}`)
			.setColor('GREEN')
            .setImage(dragon[id - 1]);

		message.channel.send(embed);
	}
}
