const Discord = require(`discord.js`);

module.exports = {
	name: 'intro',
	description: `Introduces myself briefly, in the best way o.=.o`,
    aliases: [`smaug`,`death`,`fire`],

	execute(message, args){

		const Embed = new Discord.RichEmbed()
			.setTitle(`***I'M FIRE, I'M DEATH!!!***`)
			.attachFiles([`images/cute/cute (1).gif`])
			.setImage(`attachment://cute (1).gif`);

	    message.channel.send(Embed);
	}
};
