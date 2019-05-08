const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Evirir:%40%24dfGhjkl%31%32%33@smaug-uq5av.mongodb.net/Currency?retryWrites=true', {useNewUrlParser: true}).catch(err => console.log(err));
const Money = require('../models/money.js');

module.exports = {
    name: 'inventory',
    description: 'Checks someone\'s inventory',
    aliases: ['i','inv'],
    hoard: true,
    wip: true,

    execute (message, args) {
        const target = message.mentions.users.first() || message.author;
        const items = UserData[target.id].items;

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
