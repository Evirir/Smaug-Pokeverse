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

function extract(content, position){
    position++;
    while(position--) content = content.slice(content.indexOf(/\s+/) + 1).trim();
    return content;
}

module.exports = {
    DayinMS: 24*60*60*1000,

    timefy: timefy,
    titleCase: titleCase,
    extract: extract,

    getMentionUser(client, mention){
    	if (mention.startsWith('<@') && mention.endsWith('>')) {
    		mention = mention.slice(2, -1);

    		if (mention.startsWith('!')) {
    			mention = mention.slice(1);
    		}

    		return client.users.get(mention);
    	}
        else if(!isNaN(mention)){
            return client.users.get(mention);
        }
        else{
            return client.users.find(u => u.tag === mention);
        }
    },

    getMentionChannel(message, mention){
    	if (mention.startsWith('<#') && mention.endsWith('>')) {
    		mention = mention.slice(2, -1);
        }

    	return message.guild.channels.get(mention);
    },

    getMentionRole(message, position){
        let mention = extract(message.content, position);

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
    },
};
