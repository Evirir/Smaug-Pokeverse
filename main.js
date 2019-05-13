const Discord = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');
const {uri} = require('./config.json');

const {defaultPrefix, token, bot_name} = require('./config.json');
const {dragID, drag2ID, godID, zsID, botID} = require(`./specificData/users.json`);
const {consoleID, messageID, startupID, betastartupID} = require(`./specificData/channels.json`);
const trigger = require('./triggers');
const Money = require('./models/money.js');
const Settings = require('./models/serverSettings.js');

let cooldowns = new Discord.Collection();

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commandsStd').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
	const command = require(`./commandsStd/${file}`);
	client.commands.set(command.name, command);
}
const hoardFiles = fs.readdirSync('./commandsHoard').filter(file => file.endsWith('.js'));
for(const file of hoardFiles){
	const command = require(`./commandsHoard/${file}`);
	client.commands.set(command.name, command);
}
const utilFiles = fs.readdirSync('./commandsUtil').filter(file => file.endsWith('.js'));
for(const file of utilFiles){
	const command = require(`./commandsUtil/${file}`);
	client.commands.set(command.name, command);
}
const pokeFiles = fs.readdirSync('./commandsPoke').filter(file => file.endsWith('.js'));
for(const file of pokeFiles){
	const command = require(`./commandsPoke/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	mongoose.connect(uri, {useNewUrlParser: true}).catch(err => console.log(err));
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
	const p = await Settings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
	if(!p){
		const newPrefix = new Settings({
			serverID: message.guild.id,
			prefix: ",,",
			owo: true,
			raiderLock: false
		});
		await newPrefix.save().catch(err => console.log(err));
	}
	else prefix = p.prefix;

	if(!message.content.toLowerCase().startsWith(prefix)) {
		return trigger.execute(client, message);
	}

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if(!command) return;

	//Hoard check
	const money = await Money.findOne({userID: message.author.id}).catch(err => console.log(err));
	if(!money){
		let newMoney = new Money({
			userID: message.author.id,
			money: 1000,
			nextDaily: new Date(),
			inventory: []
		});
		await newMoney.save().catch(err => console.log(err));
		message.channel.send(`Hey <@${message.author.id}>! As a new hoarder, you have received **1000💰**!`);
	}

	if(message.author.bot) return;

	if(command.wip){
		let msg = "";
		msg += `I have no spell slots left for this spell...\n`;
		msg += `(\`${commandName}\` command under maintenance)`;
		return message.reply(msg);
	}
	if(command.dev && message.author.id !== dragID){
		return message.channel.send(`This command is only available to developers.`);
	}
	if(command.args && !args.length){
		return client.commands.get(`help`).execute(message,[command.name]);
	}

	if(!cooldowns.has(command.name) && command.cd) cooldowns.set(command.name, new Discord.Collection());

	if(command.cd){
		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cdTime = command.cd * 1000;

		if(timestamps.has(message.author.id)){
			const nextTime = timestamps.get(message.author.id) + cdTime;
			if(now < nextTime){
				const timeLeft = (nextTime - now)/1000;
				return message.channel.send(`${message.author.username}, this command is on a cooldown of **${timeLeft.toFixed(2)}s**.`);
			}

			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cdTime);
		}
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
