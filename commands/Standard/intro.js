const Discord = require(`discord.js`);
const {cute} = require('../../imageLinks.json');

module.exports = {
	name: 'intro',
	description: `Introduces myself briefly, in the best way o.=.o`,
    aliases: [`smaug`,`death`,`fire`],

	execute(message, args, prefix){
		const embed = new Discord.RichEmbed()
			.setTitle(`***I'M FIRE, I'M DEATH!!!***`)
			.setColor('GREEN')
			.setImage(dragon[0]);

	    message.channel.send(embed);
	}
};
