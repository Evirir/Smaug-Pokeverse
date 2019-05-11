const Discord = require('discord.js');

function timefy(t){
    if(t<10) return '0'+t;
    else return t;
}

module.exports = {
    DayinMS: 24*60*60*1000,

    getMentionUser(client, mention){
    	if (mention.startsWith('<@') && mention.endsWith('>')) {
    		mention = mention.slice(2, -1);

    		if (mention.startsWith('!')) {
    			mention = mention.slice(1);
    		}

    		return client.users.get(mention);
    	}

        else if(isNaN(mention)){
            return client.users.get(mention);
        }

        else{
            return client.users.find(u => u.tag === mention);
        }
    },

    msToTime(diffTime){
        let diffHr = Math.floor(diffTime/(1000*60*60));
        let tmpMin = diffTime - (diffHr*(1000*60*60));
        let diffMin = Math.floor(tmpMin/(1000*60));
        let tmpSec = tmpMin - (diffMin*(1000*60));
        let diffSec = Math.floor(tmpSec/(1000));

        return `${timefy(diffHr)}h ${timefy(diffMin)}m ${timefy(diffSec)}s`;
    },
};
