const Discord = require('discord.js');

function timefy(t){
    if(t<10) return '0'+t;
    else return t;
}

function titleCase(str) {
   let splitStr = str.toLowerCase().split(' ');
   for (let i = 0; i < splitStr.length; i++) {
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
   }
   return splitStr.join(' ');
}

function extract(message, position){
    let content = message.content;
    position++;
    while(position--) content = content.slice(content.search(/\s+/) + 1).trim();
    return content;
}

module.exports = {
    DayinMS: 24*60*60*1000,

    timefy: timefy,
    titleCase: titleCase,
    extract: extract,

    getMentionUser(message, position, toEnd = 0){
        let mention;
        const args = message.content.split(/ +/);
        args.shift();

        if(toEnd) mention = extract(message, position);
        else mention = args[position];

    	if (mention.startsWith('<@') && mention.endsWith('>')) {
    		mention = mention.slice(2, -1);

    		if (mention.startsWith('!')) {
    			mention = mention.slice(1);
    		}

    		return message.client.users.get(mention);
    	}

        if(isNaN(mention)){
            return message.client.users.find(u => u.tag === mention);
        }

        return message.client.users.get(mention);
    },

    getMentionChannel(message, position, toEnd = 0){
        let mention;
        const args = message.content.split(/ +/);
        args.shift().toLowerCase();

        if(toEnd) mention = extract(message, position);
        else mention = args[position];

    	if(mention.startsWith('<#') && mention.endsWith('>')) {
    		mention = mention.slice(2, -1);
        }

    	return message.guild.channels.get(mention);
    },

    getMentionRole(message, position, toEnd = 0){
        let mention;
        const args = message.content.split(/ +/);
        args.shift().toLowerCase();

        if(toEnd) mention = extract(message, position);
        else mention = args[position];

    	if(mention.startsWith('<@&') && mention.endsWith('>')) {
    		mention = mention.slice(3, -1);
        }

        if(isNaN(mention)){
            return message.guild.roles.find(r => r.name.toLowerCase() === mention.toLowerCase());
        }

    	return message.guild.roles.get(mention);
    },

    msToTime(diffTime){
        let diffHr = Math.floor(diffTime/(1000*60*60));
        let tmpMin = diffTime - (diffHr*(1000*60*60));
        let diffMin = Math.floor(tmpMin/(1000*60));
        let tmpSec = tmpMin - (diffMin*(1000*60));
        let diffSec =  Math.floor(tmpSec/(1000));

        return `${timefy(diffHr)}h ${timefy(diffMin)}m ${timefy(diffSec)}s`;
    }
};
