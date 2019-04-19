const Discord = require('discord.js');

module.exports = {
	name: 'cute',
	description: `Summons a random cute dragon. Add number for specific cute dragon`,
	aliases: [`cutedragon`,`kawaii`,`cutederg`,`cutedrag`],
	usage: `[id]`,

	execute(message,args){
        var id = 0;
        const maxID = 19;

		if (!args.length)
            id = Math.floor(Math.random() * maxID) + 1;
        else id = args[0];

		if(isNaN(id))
			return message.channel.send(`ID is not a number! Please input an ID between 1 and ${maxID}.`);
        if(id > maxID || id < 1)
            return message.channel.send(`ID out of range! Please input an ID between 1 and ${maxID}.`);


		var path = `images/cute/cute (${id})`;
		var type = '';
        if(id === 1)	type = '.gif';
		else			type = '.jpg';
		path += type;

		const exampleEmbed = new Discord.RichEmbed()
			.setTitle(`Cute dragon #${id}`)
            .attachFiles([path])
            .setImage(`attachment://cute (${id})${type}`);

		message.channel.send(exampleEmbed);
	}
}
