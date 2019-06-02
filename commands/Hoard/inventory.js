const Discord = require('discord.js');
const GraphUser = require('../../models/graphUser.js');
const {getMentionUser} = require('../../helper.js');

module.exports = {
    name: 'inventory',
    description: 'Checks someone\'s inventory.',
    aliases: ['i','inv'],
    usage: `@mentionUser/userTag`,

    async execute (message, args) {
        let target = message.author;
        if(args.length) target = getMentionUser(message, 0) || message.author;

        let graphUser = await GraphUser.findOne({userID: target.id}).catch(err => console.log(err));
        if(!graphUser){
        	graphUser = new GraphUser({
        		userID: target.id,
        		money: 1000,
        		nextDaily: new Date(),
        		inventory: []
        	});
        	await graphUser.save().catch(err => console.log(err));
        }

        let embed = new Discord.RichEmbed()
        .setAuthor(`${target.username}'s hoard`, target.displayAvatarURL)
        .setColor('GOLD')
        .addField(`Coins`, `${graphUser.money}💰`);

        let list = "";
        graphUser.inventory.forEach(item => {
            list += `${item.name} x${item.amount}\n`;
        });

        embed.addField(`Items`, list);
        message.channel.send(embed);
	}
};
