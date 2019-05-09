const Discord = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');
const {uri} = require('./config.json');
mongoose.connect(uri, {useNewUrlParser: true}).catch(err => console.log(err));

const {defaultPrefix, token, bot_name} = require('./config.json');
const {dragID, drag2ID, godID, zsID, botID} = require(`./specificData/users.json`);
const {consoleID, messageID, startupID, betastartupID} = require(`./specificData/channels.json`);
const trigger = require('./triggers');
const Money = require('./models/money.js');
const Prefix = require('./models/prefix.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./stdCommands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
	const command = require(`./stdCommands/${file}`);
	client.commands.set(command.name,command);
}
const hoardFiles = fs.readdirSync('./hoardCommands').filter(file => file.endsWith('.js'));
for(const file of hoardFiles){
	const command = require(`./hoardCommands/${file}`);
	client.commands.set(command.name,command);
}

client.once('ready', () => {
	let startmsg = `It's currently **${client.readyAt}**\n`;
	startmsg += `Users: **${client.users.size}**, Channels: **${client.channels.size}**, Servers: **${client.guilds.size}**`;
	console.log(startmsg);
  	client.channels.get(startupID).send(startmsg);
  	client.channels.get(betastartupID).send(startmsg);
  	client.user.setActivity(`${client.users.size} hoomans and dragons`, { type: "WATCHING"});
});

client.on("guildCreate", guild => {
  	console.log(`I've discovered a new guild!: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  	client.channels.get(messageID).send(`I've discovered a new guild!: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
 });

client.on("guildDelete", guild => {
  	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  	client.channels.get(messageID).send(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on('message', async message => {
	if(!message.guild) return;

	let prefix = ",,";
	Prefix.findOne({serverID: message.guild.id}, (err, p) => {
		if(err) return console.log(err);
		if(!p){
			const newPrefix = new Prefix({
				serverID: message.guild.id,
				prefix: ",,"
			});
			newPrefix.save().catch(err => console.log(err));
		}
		else prefix = p;
	});

	if(!message.content.toLowerCase().startsWith(prefix)) {
		return trigger.execute(client, message);
	}

	if(message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if(!command) return;

	//Hoard check
	Money.findOne({userID: message.author.id}, (err, money) => {
		if(err) console.log(err);

		if(!money){
			const newMoney = new Money({
				userID: message.author.id,
				money: 1000
			});

			newMoney.save().catch(err => console.log(err));
			message.channel.send(`Hey <@${message.author.id}>! As a new hoarder, you have received **1000💰**!`);
		}
	});

	if(command.wip){
		let msg = "";
		msg += `I have no spell slots left for this spell...\n`;
		msg += `(\`${commandName}\` command under maintenance)`;
		return message.reply(msg);
	}
	if(command.dev && message.author.id !== dragID){
		return message.channel.send(`This command is only available to developers.`);
	}
	if(command.args && command.usage && !args.length){
		return client.commands.get(`help`).execute(message,[command.name]);
	}

	try{
		command.execute(message, args, prefix);
	}
	catch(error){
		console.error(error);
		client.channels.get(consoleID).send(error);
		if(message.author.id === dragID)
			return message.reply(`I have some issues here, go check the log ó.=.ò"`)
		else
			return message.reply(`I've encountered some error, tell <@${dragID}> and blame him for that =. .=`);
	}
});

client.login(token);
