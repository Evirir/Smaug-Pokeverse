module.exports = {
	name: 'balance',
	description: `Checks someone's balance`,
    aliases: ['b','bal','money'],
    br: true,

	execute(brData, message, args){
        const target = message.mentions.users.first() || message.author;
		if(target === message.author)
        	return message.reply(`you have **${brData[target.id].bal}💰**.`);
		return message.reply(`**${target.tag}** has **${brData[target.id].bal}💰**.`);
    }
};
