const fs = require('fs');
const Discord = require('discord.js');
const {prefix,token,evitoken,bot_name} = require('./config.json');
const {dragID,drag2ID,godID,zsID} = require(`./users.json`);
const {consoleID,messageID,startupID,betastartupID} = require(`./channels.json`);
const {isoAdminID} = require(`./roles.json`);

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldown = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
	const command = require(`./commands/${file}`);
	client.commands.set(command.name,command);
}

client.once('ready', () => {
	let startmsg = `*Yawns~* mornin' Evirir...u.=.o\n`;
	startmsg += `Watching ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`;
	console.log(startmsg);
  	client.channels.get(startupID).send(startmsg);
  	client.channels.get(betastartupID).send(startmsg);
  	client.user.setActivity(`${client.users.size} hoomans and dragons`, { type: "WATCHING"});
});

client.on("guildCreate", guild => {
  	console.log(`I've discovered a new guild!: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  	client.channels.get(consoleID).send(`I've discovered a new guild!: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
 });

client.on("guildDelete", guild => {
  	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  	client.channels.get(consoleID).send(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

// MENTION REPLIES START
client.on('message', message => {
	if(message.author.bot) return;
	if(message.channel.type === `dm` && message.author.id !== dragID && message.author.id !== drag2ID) return;
	if(message.content.startsWith(`${prefix}`)) return;

	//EVIRIR IS MENTIONED
	if (message.isMentioned(client.users.get(dragID))){
	    if (message.author.id === dragID || message.author.id === drag2ID){
	    	message.channel.send('Why are you mentioning yourself...<@${message.author.id}>');
	    	return;
	    }
	    if(message.author.id === godID){
	    	message.channel.send(`${message.author.id}, ya' finding Evirir-sama?`);
	    }
	    else
	    	message.channel.send(`Did someone call Evirir-sama...? I'll get him!`);
			message.channel.get(consoleID).send(`${message.author.name} said: ${message.content}`);
	}

	//BOT SELF IS MENTIONED
	if (message.isMentioned(client.user) || message.content.toLowerCase().includes(`${bot_name}`)) {
		const msg = message.content.toLowerCase();

		if(message.author === (client.users.get(dragID))){
			if(msg.includes(`hey`) || msg.includes(`hi`) || msg.includes(`rytsas`) || msg.includes(`hewwo`))
				message.reply(`hey...**snuggles you**`);
			else if(msg.includes(`thank you`) || msg.includes(`thanks`))
				message.channel.send(`You're welcome <@${dragID}>...**nuzzles you**\nI'll always be with you...`);
			else
	    		message.channel.send(`<@${dragID}>...is that you...? Ghrrr! Evirir-chan you came! **leaps around you happily**`);
			return;
	  	}

		else if(message.author === (client.users.get(godID))){
			if(msg.includes(`hey`) || msg.includes(`hi`) || msg.includes(`rytsas`) || msg.includes(`hewwo`))
				message.channel.send(`Hey <@${godID}>...will I become a powerful dragon wizard in the future?`);
			else if(msg.includes(`thank you`) || msg.includes(`thanks`))
				message.channel.send(`Y-you're welcome! Always under your wings, <@${godID}>...`);
			else message.channel.send(`<@${godID}>...**offers cookies respectfully**\nThere you go, more tasty cookies I found from Earth.`);
			return;
	  	}

		if(msg.includes(`hey`) || msg.includes(`hi`) || msg.includes(`rytsas`) || msg.includes(`hewwo`))
			message.channel.send('Hrrr, <@${message.author.id}>! Do you have any cookies?');
		if(msg.includes(`thank you`) || msg.includes(`thanks`))
			message.reply(`you're welcome! **takes your cookies** ...but for what?`);
	  	else
	    	message.reply(`I'm here~ **wags tail**`);

		return;
	}

	//MESSAGE CONTAINS TRIGGER
	if(message.content.toLowerCase().includes('dragon' || 'dragons')){
	  	message.channel.send(`Did someone said...**DRAGONS**?`);
	}
});
//MENTION REPLIES END

//STANDARD COMMANDS START
client.on('message', message => {
	if(message.author.bot) return;
	if(!message.content.startsWith(prefix) && !message.content.startsWith(prefix.toUpperCase())) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if(!command) return;

	if(command.args && command.usage && !args.length){
		let reply = `Command: \`${command.name}\``;
		if(command.aliases)
			reply += `\nAliases: \`${prefix}${command.aliases}\``;
		reply += `\nUsage: \`${prefix}${command.name} ${command.usage}\`\nDescription: ${command.description}`;
		return message.channel.send(reply);
	}

	try{
		command.execute(message,args);
	}
	catch(error){
		console.error(error);
		message.channel.get(consoleID).send(error);
		if(message.author.id === dragID || message.author.id === drag2ID)
			message.reply(`I have some issues here, go check the log ó.=.ò"`)
		else
			message.reply(`I've encountered some error, tell <@${dragID}> and blame him for that =. .=`);
	}
});
//STANDARD COMMANDS END

client.login(token);
