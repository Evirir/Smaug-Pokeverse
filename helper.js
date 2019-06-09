const Discord = require('discord.js');
const GraphUser = require('./models/graphUser.js');
const GraphServer = require('./models/graphServer.js');
const GraphClient = require('./models/graphClient.js');

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

//returns string from args[position] till the end
function extract(message, position){
    let content = message.content;
    position++;
    while(position--) content = content.slice(content.search(/\s+/) + 1).trim();
    return content;
}

function ordinal(num){
    num = num.toString();

    let suffix = "";
    if(num.endsWith('1'))       suffix = "st";
    else if(num.endsWith('2'))  suffix = "nd";
    else if(num.endsWith('3'))  suffix = "rd";
    else                        suffix = "th";

    return num + suffix;
}

function getEdge(u, v, graphServer){
    return graphServer.adj[u].find(e => e.v === v) || graphServer.adj[v].find(e => e.v === u);
}

module.exports = {
    DayinMS: 24*60*60*1000,

    timefy: timefy,
    titleCase: titleCase,
    extract: extract,
    ordinal: ordinal,
    getEdge: getEdge,

    getMentionUser(message, position){
        let mention = extract(message, position);
        mention = mention.slice(0, mention.search(/#\d{4}/)+5);

    	if (mention.startsWith('<@') && mention.endsWith('>')) {
    		mention = mention.slice(2, -1);

    		if (mention.startsWith('!')) {
    			mention = mention.slice(1);
    		}
    	}

        if(isNaN(mention)){
            return message.client.users.find(u => u.tag === mention);
        }

        return message.client.users.get(mention);
    },

    getMentionChannel(message, position){
        const args = message.content.split(/ +/);
        args.shift().toLowerCase();

        let mention = args[position];

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
    },

    async newGraphUser(user, joined = 1){
        //const {userTypes} = require('./specificData/userTypes.js');
        let graphClient = await GraphClient.findOne().catch(err => console.log(err));
        if(!graphClient) return console.log(`helper.js/newGraphUser: No graphClient found.`);

        const newUser = new GraphUser({
            userID: user.id,
            joined: (joined ? graphClient.totalGraphers : -1),
            money: 1000,
            energy: 6,
            kills: 0,
            deaths: 0,
            nextDaily: new Date(),
            inventory: []
        });

        graphClient.totalGraphers += joined;

        await graphClient.save().catch(err => console.log(err));
        return newUser;
    },

    async newGraphServerUser(user, graphServer){
        const currentNode = graphServer.nodeCount;
        graphServer.userLocations.push({
            id: user.id,
            node: currentNode
        });
        await graphServer.nodeUsers.push([user.id]);
        await graphServer.adj.push([]);
        graphServer.nodeCount++;
        await graphServer.save().catch(err => console.log(err));
    }
};
