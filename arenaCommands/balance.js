const fs =  require('fs');
const UserData = JSON.parse(fs.readFileSync('./arenaData/UserInv.json','utf8'));
const ShopList = JSON.parse(fs.readFileSync('./arenaData/ShopList.json','utf8'));
const ShopItems = JSON.parse(fs.readFileSync('./arenaData/ShopItems.json','utf8'));

module.exports = {
	name: 'balance',
	description: `Checks someone's balance`,
    aliases: ['b','bal','money'],
    br: true,

	execute (message, args) {
        const target = message.mentions.users.first() || message.author;
		if(target === message.author)
        	return message.reply(`you have **${UserData[target.id].bal}💰**.`);
		return message.reply(`**${target.tag}** has **${UserData[target.id].bal}💰**.`);
    }
};
