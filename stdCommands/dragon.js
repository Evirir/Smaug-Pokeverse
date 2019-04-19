const Discord = require('discord.js');

module.exports = {
	name: 'dragon',
	description: `Summons a random dragon. Add number for specific dragon`,
	aliases: [`dragons`,`derg`,`drag`],
	usage: `[id]`,

	execute(message,args){
        var id = 0;
        const maxID = 43;

		if (!args.length)
            id = Math.floor(Math.random() * maxID) + 1;
        else id = args[0];

		if(isNaN(id))
			return message.channel.send(`ID is not a number! Please input an ID between 1 and ${maxID}.`);
        if(id > maxID || id < 1)
            return message.channel.send(`ID out of range! Please input an ID between 1 and ${maxID}.`);

        const path = `./images/dragon/dragon (${id}).png`;
		const embed = new Discord.RichEmbed()
			.setTitle(`Dragon #${id}`)
            .attachFiles([path])
            .setImage(`attachment://dragon (${id}).png`);

		message.channel.send(embed);
	}
}
