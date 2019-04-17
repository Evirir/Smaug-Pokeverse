const fs = require('fs');
const Discord = require('discord.js');
const {prefix,token,bot_name} = require('./config.json');
const {dragID,drag2ID,godID,zsID,botID} = require(`./users.json`);
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
	let startmsg = `*Yawns~* mornin' Evirir...u.=.o\nIt's currently **${client.readyAt}**\n`;
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
	if(message.author.bot || message.author.id === botID) return;
	if(message.content.startsWith(`${prefix}`)) return;

	//EVIRIR IS MENTIONED
	if (message.isMentioned(client.users.get(dragID))){
	    if (message.author.id === dragID){
	    	message.channel.send(`Evirir, why are you mentioning yourself...?`);
	    	return;
	    }
	    if(message.author.id === godID){
	    	message.channel.send(`${message.author.id}, ya' calling Evirir-sama?`);
	    }
	    else
	    	message.channel.send(`Did someone call Evirir-sama...? I'll get him!`);
			client.users.get(consoleID).send(`${message.author.name} said: ${message.content}`);
	}

	//BOT SELF IS MENTIONED
	if (message.isMentioned(client.user) || message.content.toLowerCase().includes(`${bot_name}`)) {
		const msg = message.content.toLowerCase();

		if(msg.includes(`what do you do`) || msg.includes(`what can you do`))
			return message.channel.send(`I can perform magic spells that Evirir have taught me, such as spamming people, teleporting and delete the whole channel (jk).\nType \`${prefix}help\` for more on what I can do!`);

		if(message.author === (client.users.get(dragID))){
			if(msg.includes(`hey`) || msg.includes(`hi`) || msg.includes(`rytsas`) || msg.includes(`hewwo`))
				return message.reply(`hey...**snuggles you**`);
			if(msg.includes(`thank you`) || msg.includes(`thanks`))
				return message.channel.send(`You're welcome <@${dragID}>! **licks you**`);
			if(msg.includes(`cookie`))
				return message.channel.send(`Cookie? Sure! **noms cookie**`);
			if(msg.includes(`are you good`))
				return message.channel.send(`I'll try my best, <@${message.author.id}>!`);
			if(msg.includes(`good`))
				return message.channel.send(`Thanks! **licks your face**`);
	    	return message.channel.send(`Evirir-sama you came! **leaps around you happily**`);
	  	}

		if(message.author === (client.users.get(godID))){
			if(msg.includes(`hey`) || msg.includes(`hi`) || msg.includes(`rytsas`) || msg.includes(`hewwo`))
				return message.channel.send(`Hey <@${godID}>...will I become a powerful dragon wizard in the future?`);
			if(msg.includes(`thank you`) || msg.includes(`thanks`))
				return message.channel.send(`Y-you're welcome! Always under your wings, <@${godID}>...`);
			if(msg.includes(`cookie`))
				return message.channel.send(`Cookie? Sure! **noms cookie**`);
			if(msg.includes(`are you good`))
				return message.channel.send(`I'll try my best, <@${message.author.id}>!`);
			if(msg.includes(`good`))
				return message.channel.send(`Thanks! **licks your face**`);
			return message.channel.send(`<@${godID}>...**offers cookies respectfully**\nThere you go, more tasty cookies I found from Earth.`);
	  	}

		if(msg.includes(`hey`) || msg.includes(`hi`) || msg.includes(`rytsas`) || msg.includes(`hewwo`))
			return message.channel.send(`Hrrr, <@${message.author.id}>! Do you have any cookies?`);
		if(msg.includes(`thank you`) || msg.includes(`thanks`))
			return message.reply(`you're welcome! **takes your cookies** ...but for what?`);
		if(msg.includes(`cookie`))
			return message.channel.send(`Cookie? Sure! **noms cookie**`);
		if(msg.includes(`are you good`))
			return message.channel.send(`I'll try my best, <@${message.author.id}>!`);
		if(msg.includes(`good`))
			return message.channel.send(`Thanks! **licks your face**`);
	    return message.reply(`I'm here~ **wags tail**`);

		return;
	}

	//MESSAGE CONTAINS TRIGGER
	if(message.content.toLowerCase().includes('good dragon'))
	  	return message.channel.send(`Thanks! **licks your face**`);
	if(message.content.toLowerCase().includes('dragon'))
	  	return message.channel.send(`Did someone say...**DRAGONS**?`);
	if(message.content.toLowerCase().includes('owo'))
		  return message.channel.send(`uwu`);
	if(message.content.toLowerCase() === ('uwu'))
		return message.channel.send(`owo`);
	if(message.content.toLowerCase().includes('wew'))
		  return message.channel.send(`lad`);

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
	if(command.wip){
		var msg = "";
		msg += `I have no spell slots left for this spell...\n`;
		msg += `(\`${prefix}${commandName}\` command under maintenance)`;
		message.reply(msg);
		return;
	}
	if(command.admin && message.author.id !== dragID){
		return message.channel.send(`This command is only available to developers.`);
	}
	if(command.args && command.usage && !args.length){
		return client.commands.get(`help`).execute(message,[command.name]);
	}

	try{
		command.execute(message, args);
	}
	catch(error){
		console.error(error);
		if(message.author.id === dragID || message.author.id === drag2ID)
			message.reply(`I have some issues here, go check the log ó.=.ò"`)
		else
			message.reply(`I've encountered some error, tell <@${dragID}> and blame him for that =. .=`);
	}
});
//STANDARD COMMANDS END

client.login(token);
