const fs = require('fs');
const Discord = require('discord.js');
const {prefix,token,dragID,drag2ID,godID,bot_name} = require('./config.json');

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
  client.channels.get('559317991762952193').send(startmsg);
  client.user.setActivity(`${client.users.size} hoomans and dragons`, { type: "WATCHING"});
});

client.on("guildCreate", guild => {
  console.log(`I've discovered a new guild!: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.channels.get('559302976855080980').send(`I've discovered a new guild!: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
 });

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.channels.get('559302976855080980').send(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

// MENTION REPLIES START
client.on('message', message => {
	if(message.author.bot) return;
	if(message.content.startsWith(`${prefix}`)) return;

	//EVIRIR IS MENTIONED
	if (message.isMentioned(client.users.get(dragID))){
	    if (message.author === (client.users.get(dragID))){
	    	message.channel.send('Yay!');
	    	return;
	    }
	    if(message.author === (client.users.get(dragID))){
	    	message.channel.send('The dragon has called my master.');
	    }
	    else
	    	message.channel.send(`Hey hey! I'll look for him!`);
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
		if(commandName === `uptime`){
			return command.execute(message,client.uptime);
		}

		if(commandName === `ping`)
			return command.execute(message,client.ping);

		command.execute(message,args);
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
