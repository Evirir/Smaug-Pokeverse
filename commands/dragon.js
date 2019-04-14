const Discord = require('discord.js');

module.exports = {
	name: 'dragon',
	description: `Summons a random dragon. Add number for specific dragon`,
	aliases: [`dragons`,`derg`,`drag`],
	usage: `[id]`,

	execute(message,args){
        var id = 0;
        const maxID = 44;

		if (!args.length)
            id = Math.floor(Math.random() * maxID) + 1;
        else id = args[0];

        if(isNaN(id) || id > maxID || id < 1)
            return message.channel.send(`ID out of range! Please input an ID between 1 and ${maxID}.`);

        const path = `images/dragon/dragon (${id}).png`;
		const embed = new Discord.RichEmbed()
			.setTitle(`Dragon #${id}`)
            .attachFiles([`images/dragon/dragon (${id}).png`])
            .setImage(`attachment://dragon (${id}).png`);

		message.channel.send(embed);
	}
}
