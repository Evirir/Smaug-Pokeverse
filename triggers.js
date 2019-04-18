const {bot_name} = require('./config.json');
const {dragID,godID} = require('./users.json');
const {consoleID} = require('./channels.json');

module.exports = {
    execute(client,message) {
        //EVIRIR IS MENTIONED
        if (message.isMentioned(client.users.get(dragID))){
            if (message.author.id === dragID){
                return message.channel.send(`Evirir, why are you mentioning yourself...?`);
            }
            if(message.author.id === godID){
                return message.channel.send(`${message.author.id}, ya' calling Evirir-sama?`);
            }
            else
                message.channel.send(`Did someone call Evirir-sama...? I'll get him!`);
                return client.users.get(consoleID).send(`${message.author.name} mentioned you:\n${message.content}`);
        }

        //BOT SELF IS MENTIONED
        if (message.isMentioned(client.user) || message.content.toLowerCase().includes(`${bot_name}`)) {
            const msg = message.content.toLowerCase();

            if(msg.includes(`what do you do`) || msg.includes(`what can you do`))
                return message.channel.send(`I can perform magic spells that Evirir have taught me, such as spamming people, teleporting, responding to my name and eating cookies ~~and deleting the whole channel~~.\nType \`${prefix}help\` for more on what I can do!`);
            if(msg.includes(`are you good`))
                return message.channel.send(`I'll try my best, <@${message.author.id}>!`);
            if(msg.includes(`good`))
                return message.channel.send(`Thanks! **licks your face**`);
            if(msg.includes(`cookie`))
                return message.channel.send(`**noms cookie**`);
            if(msg.includes(`help`))
                return client.commands.get('help').execute(message,[]);

            if(message.author === (client.users.get(dragID))){
                if(msg.includes(`hey`) || msg.includes(`hi`) || msg.includes(`rytsas`) || msg.includes(`hewwo`))
                    return message.reply(`hey...**snuggles you**`);
                if(msg.includes(`thank you`) || msg.includes(`thanks`))
                    return message.channel.send(`You're welcome <@${dragID}>! **licks you**`);
                return message.channel.send(`Evirir-sama you came! **leaps around you happily**`);
            }

            if(message.author === (client.users.get(godID))){
                if(msg.includes(`hey`) || msg.includes(`hi`) || msg.includes(`rytsas`) || msg.includes(`hewwo`))
                    return message.channel.send(`Hey <@${godID}>...will I become a powerful dragon wizard in the future?`);
                if(msg.includes(`thank you`) || msg.includes(`thanks`))
                    return message.channel.send(`Y-you're welcome! Always under your wings, <@${godID}>...`);
                return message.channel.send(`<@${godID}>...**offers cookies respectfully**\nThere you go, more tasty cookies I found from Earth.`);
            }

            if(msg.includes(`hey`) || msg.includes(`hi`) || msg.includes(`rytsas`) || msg.includes(`hewwo`))
                return message.channel.send(`Hrrr, <@${message.author.id}>! Do you have any cookies?`);
            if(msg.includes(`thank you`) || msg.includes(`thanks`))
                return message.reply(`you're welcome! **takes your cookies** ...but for what?`);
            return message.reply(`I'm here~ **wags tail**`);
        }

        //MESSAGE CONTAINS TRIGGER
        const msg = message.content.toLowerCase();

        if(msg.includes('good dragon'))
            return message.channel.send(`Thanks! **licks your face**`);
        if(msg.includes('dragon'))
            return message.channel.send(`Did someone say...**DRAGON**?`);
        if(msg.includes(`rawr`))
            return message.channel.send('*ghrr*');
        if(msg.includes(`grr`) || msg.includes(`ghrr`))
            return message.channel.send('*rawr*');
        if(msg === 'owo')
            return message.channel.send(`uwu`);
        if(msg === 'uwu')
            return message.channel.send(`owo`);
        if(msg === 'wew')
            return message.channel.send(`lad`);
    }
};
