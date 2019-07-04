const Discord = require('discord.js');
const GraphUser = require('./models/graphUser.js');
const GraphServer = require('./models/graphServer.js');
const GraphClient = require('./models/graphClient.js');
const {pokeverseID, geomID} = require('./specificData/users.json');

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
    return graphServer.adj[u].find(e => e.v === v);
}

function statusToPokeType(status){
    let pokeType = "(undefined)";
    if(status === 'raider')     pokeType = 'Raider';
    if(status === 'rare')       pokeType = 'rare Pokémon';
    if(status === 'megaboss')   pokeType = 'Mega Boss';

    return pokeType;
}

async function lockRoles(client, message, prefix, raider, raiderSettings, status, targetEmbed){
    let roleError = false;

    const lockRoles = raiderSettings.lockRoles;
    lockRoles.forEach(r => {
        const role = message.guild.roles.get(r);
        if(!role){
            raiderSettings.lockRoles.pull(r);
            return;
        }

        message.channel.overwritePermissions(role, {
            SEND_MESSAGES: false
        }).catch(err => {
            console.log(err);
            if(!roleError){
                roleError = true;
                return message.channel.send(`Failed to lock channel for one of the roles! Please ensure that Smaug has the 'Manage Permissions' permission in the channel.`);
            }
        });
    });

    //Check if the active user is still raiding. If yes, remove his permission to send messages.
    //Thus - make sure you lockRoles() first before changing the raider properties
    const activeUserPerm = message.channel.permissionOverwrites.get(raider.activeUserID);
    if(activeUserPerm) activeUserPerm.delete();

    //exclude pokeverse
    const pokeverseUser = client.users.get(pokeverseID);
    message.channel.overwritePermissions(pokeverseUser, {
        SEND_MESSAGES: true
    }).catch(err => console.log(err));

    raider.status = status;
    raider.activeUserID = undefined;
    raider.spawnedBy = undefined;
    await raider.save().catch(err => console.log(err));

    //logging and sending messages
    const pokeType = statusToPokeType(status);

    console.log(`${pokeType} spawned at ${message.guild.name}/${message.channel.name} (Channel ID: ${message.channel.id})`);

    const geomUser = await client.users.get(geomID);
    if(message.guild.member(geomUser)) geomUser.send(`${pokeType} spawned at ${message.guild.name}/${message.channel.name}`);


    let msg = `A ${pokeType} has spawned! Type \`${prefix}raid #${message.channel.name}\` in other channels to unlock the channel and fight the ${pokeType}.`;

    if(targetEmbed && targetEmbed.author){
        msg += `\nSpawned by: **${targetEmbed.author.name}**`;
    }

    return message.channel.send(msg).catch(err => console.log(err));
}

function unlockRoles(message, targetChannel, raider, raiderSettings){
    raiderSettings.lockRoles.forEach(async r => {
        await targetChannel.overwritePermissions(message.guild.roles.get(r), {
            SEND_MESSAGES: true
        });
        console.log(`${message.guild.name}/${targetChannel.name}: ${message.guild.roles.get(r).name} unlocked.`);
    });

    raider.status = undefined;
    raider.activeUserID = undefined;
    raider.spawnedBy = undefined;
    raider.save().catch(err => console.log(err));
}


module.exports = {
    DayinMS: 24*60*60*1000,

    timefy: timefy,
    titleCase: titleCase,
    extract: extract,
    ordinal: ordinal,
    getEdge: getEdge,

    lockRoles: lockRoles,
    unlockRoles: unlockRoles,
    statusToPokeType: statusToPokeType,

    getMentionUser(message, position, toEnd = 1){
        let mention;
        if(!toEnd){
            const args = message.content.split(/\s+/);
            mention = args[position + 1];
        }
        else mention = extract(message, position);

    	if (mention.startsWith('<@') && mention.endsWith('>')) {
    		mention = mention.slice(2, -1);

    		if (mention.startsWith('!')) {
    			mention = mention.slice(1);
    		}
    	}

        if(isNaN(mention)){
            mention = mention.slice(0, mention.search(/#\d{4}/)+5);
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

        return `${diffHr}h ${diffMin}m ${diffSec}s`;
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
        graphServer.nodeUsers.push({
            node: currentNode,
            users: [user.id]
        });
        graphServer.adj.push([]);
        graphServer.nodeCount++;
        await graphServer.save().catch(err => console.log(err));
    }
};
