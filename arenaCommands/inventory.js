module.exports = {
    name: 'inventory',
    description: 'Checks someone\'s inventory',
    aliases: ['i','inv'],
    br: true,

    async execute(brData, message, args){
        const target = message.mentions.users.first() || message.author;
        const items = brData[target.id].items;

        if(!items.length) return message.channel.send(`**${target.tag}** has an **empty** hoard and is lonely...`);

        let msg = `**${target.id}'s hoard:\n**`;
        items.map(i => {
            if(i.amount === 1)
                msg += `${i.name}\n`;
            else
                msg += `${i.name} (x${i.amount})\n`;
        });

        message.channel.send(msg);
	}
};
