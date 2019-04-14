const Discord = require('discord.js');

module.exports = {
	name: 'cute',
	description: `Summons a random cute dragon. Add number for specific cute dragon`,
	aliases: [`cutedragon`,`kawaii`,`cutederg`,`cutedrag`],
	usage: `[id]`,

	execute(message,args){
        var id = 0;
        const maxID = 17;

		if (!args.length)
            id = Math.floor(Math.random() * maxID) + 1;
        else id = args[0];

        if(id > maxID)
            return message.channel.send(`ID out of range! Please input an ID between 1 and ${maxID}.`);

        const path = `images/cute/cute (${id}).jpg`;
		const embed = new Discord.RichEmbed()
			.setTitle(`Cute dragon #${id}`)
            .attachFiles([path])
            .setImage(`attachment://cute (${id}).jpg`)

		message.channel.send(embed);
	}
}
