module.exports = {
	name: 'balance',
	description: `Checks someone's balance`,
    aliases: ['b','bal','money'],
    br: true,

	execute(currency, message, args){
        const target = message.mentions.users.first() || message.author;
		if(target === message.author)
        	return message.reply(`you have **${currency[target.id].bal}💰** gold coins.`);
		return message.reply(`**${target.tag}** has **${currency[target.id].bal}💰** gold coins.`);
    }
};
