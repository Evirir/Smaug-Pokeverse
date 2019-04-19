

module.exports = {
    name: 'inventory',
    description: 'Checks someone\'s inventory',
    aliases: ['i','inv'],
    hoard: true,
    wip: true,

    async execute(currency, message, args){
        const target = message.mentions.users.first() || message.author;
        const user = await Users.findByPk(target.id);
        const items = await user.getItems();

        if(!userItems.length) return message.channel.send(`**${target.tag}** has an **empty** hoard and is lonely...`);

        let msg = `**${target.id}'s hoard:\n**`;
        items.map( i => {
            if(i.item.amount == 1)
                msg += `${i.name}\n`;
            else
                msg += `${i.name} (x${i.item.amount})\n`;
        });
	}
};