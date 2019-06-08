const Discord = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');
const {defaultPrefix, bot_name} = require('./config.json');
const {newGraphUser, newGraphServerUser} = require('./helper.js');

const {dragID, drag2ID, godID, zsID, botID} = require(`./specificData/users.json`);
const {consoleID, messageID, startupID, betastartupID} = require(`./specificData/channels.json`);
const trigger = require('./triggers/triggers.js');
const Settings = require('./models/serverSettings.js');
const GraphUser = require('./models/graphUser.js');
const GraphServer = require('./models/graphServer.js');
const GraphClient = require('./models/graphClient.js');

let cooldowns = new Discord.Collection();

const client = new Discord.Client();
const hoardCommands = [];
const gameCommands = [];
client.commands = new Discord.Collection();

const categories = fs.readdirSync('./commands');
categories.forEach(category => {
	const commandFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
	commandFiles.forEach(file => {
		const command = require(`./commands/${category}/${file}`);
		client.commands.set(command.name, command);
		if(category === 'Hoard') hoardCommands.push(command.name);
		else if(category === 'Battle Royale') gameCommands.push(command.name);
	});
});

client.once('ready', () => {
	mongoose.connect(process.env.RACCOON, {useNewUrlParser: true}).catch(err => console.log(err));
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
	let prefix = ",,";
	const s = await Settings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
	if(!s && message.guild){
		const newPrefix = new Settings({
			serverID: message.guild.id,
			prefix: ",,"
		});
		await newPrefix.save().catch(err => console.log(err));
	}
	else prefix = s.prefix;

	if(!message.content.toLowerCase().startsWith(prefix)) {
		return trigger.execute(client, message);
	}

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if(!command) return;
	if(message.channel.type === 'dm' && !gameCommands.includes(command.name)) return;	//only allow game commands in single DMs
	if(message.author.bot) return;

	if(command.wip){
		let msg = "";
		msg += `I have no spell slots left for this spell...\n`;
		msg += `(\`${command.name}\` command under maintenance)`;
		return message.reply(msg);
	}
	if(command.dev && message.author.id !== dragID){
		return message.channel.send(`This command is only available to developers.`);
	}
	if(command.args && !args.length){
		return client.commands.get('help').execute(message, args, prefix);
	}

	if(!cooldowns.has(command.name) && command.cd) cooldowns.set(command.name, new Discord.Collection());

	if(command.cd){
		const now = Date.now();
		let timestamps = cooldowns.get(command.name);
		const cdTime = command.cd * 1000;

		if(timestamps.has(message.author.id)){
			const nextTime = timestamps.get(message.author.id) + cdTime;
			if(now < nextTime){
				const timeLeft = (nextTime - now)/1000;
				const cdMessage = await message.channel.send(`${message.author.username}, the \`${command.name}\` command is on a cooldown of **${timeLeft.toFixed(2)}s**.`);
				cdMessage.delete(3000);
				message.delete(3000);
				return;
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cdTime);
	}

	//Hoard check start
	if(hoardCommands.includes(command.name)){
		let graphClient = await GraphClient.findOne().catch(err => console.log(err));
		if(!graphClient){
			graphClient = new GraphClient({
				totalGraphers: 0
			});
			await graphClient.save().catch(err => console.log(err));
		}

		let graphServer = await GraphServer.findOne({serverID: message.guild.id}).catch(err => console.log(err));
		if(!graphServer){
			graphServer = new GraphServer({
				serverID: message.guild.id,
			    nodeCount: 0,
			    adj: [],
			    graphUsers: [],
			    nodeUsers: []
			});
			await graphServer.save().catch(err => console.log(err));
		}

		let currentNode = graphServer.graphUsers.get(message.author.id);
		if(currentNode === undefined){
			await newGraphServerUser(message.author, graphServer);
		}

		let graphUser = await GraphUser.findOne({userID: message.author.id}).catch(err => console.log(err));
		if(!graphUser || graphUser.joined === -1){
			graphUser = await newGraphUser(message.author);

			const embed = new Discord.RichEmbed()
			.setAuthor(`${message.author.username}, welcome to the graph arena!`, message.author.displayAvatarURL)
			.setDescription(`Most of the commands in this game are useless for now tho haha`)
			.setColor('ORANGE')

			message.channel.send(embed);
			await graphUser.save().catch(err => console.log(err));
		}

	}
	//Hoard check end

	try{
		command.execute(message, args, prefix);
	}
	catch(err){
		console.log(err);
		client.channels.get(consoleID).send(`Error at ${message.guild.name}/${message.channel.name}/${message.id} (${message.guild.id}/${message.channel.id}):\n\`${err.message}\``);
		if(message.author.id === dragID)
			return message.reply(`I have some issues here, go check the log ó.=.ò"\nError: \`${err.message}\``)
		else
			return message.reply(`I've encountered some error, tell <@${dragID}> and blame him for that =. .=\nError: \`${err.message}\``);
	}
});

client.login(process.env.MEOWS);
