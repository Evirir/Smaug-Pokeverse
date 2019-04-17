const fs = require('fs');
const Discord = require('discord.js');
const {defaultPrefix,token,bot_name} = require('./config.json');
const {dragID,drag2ID,godID,zsID,botID} = require(`./users.json`);
const {consoleID,messageID,startupID,betastartupID} = require(`./channels.json`);
const {isoAdminID} = require(`./roles.json`);
const trigger = require('./triggers.js');

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
	startmsg += `Users: **${client.users.size}**, Channels: **${client.channels.size}**, Servers: **${client.guilds.size}**`;
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

client.on('message', message => {
	let prefixes = JSON.parse(fs.readFileSync("./prefixes.json","utf8"));

	if(!prefixes[message.guild.id]){
		prefixes[message.guild.id] = {
			prefix: defaultPrefix
		}
		fs.writeFileSync('./prefixes.json', JSON.stringify(prefixes));
		prefixes = JSON.parse(fs.readFileSync("./prefixes.json","utf8"));
	}

	let prefix = prefixes[message.guild.id].prefix;

	if(message.author.bot) return;
	if(!message.content.startsWith(prefix) && !message.content.startsWith(prefix.toUpperCase())) {
		trigger.execute(client, message);
	}

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
		if(message.author.id === dragID)
			message.reply(`I have some issues here, go check the log ó.=.ò"`)
		else
			message.reply(`I've encountered some error, tell <@${dragID}> and blame him for that =. .=`);
	}
});

client.login(token);
