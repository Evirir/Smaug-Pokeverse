const Discord = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');
const {uri} = require('./config.json');

const {defaultPrefix, token, bot_name} = require('./config.json');
const {dragID, drag2ID, godID, zsID, botID} = require(`./specificData/users.json`);
const {consoleID, messageID, startupID, betastartupID} = require(`./specificData/channels.json`);
const trigger = require('./triggers/triggers.js');
const Money = require('./models/money.js');
const Settings = require('./models/serverSettings.js');
const GraphUser = require('./models/graphUser.js');
const GraphClient = require('./models/graphClient.js');

let cooldowns = new Discord.Collection();

const client = new Discord.Client();
client.commands = new Discord.Collection();
const Categories = [`Hoard`,`Poke`,`Std`,`Util`];

Categories.forEach(category => {
	const commandFiles = fs.readdirSync(`./commands${category}`).filter(file => file.endsWith('.js'));
	for(const file of commandFiles){
		const command = require(`./commands${category}/${file}`);
		client.commands.set(command.name, command);
	}
});

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
	const s = await Settings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
	if(!s){
		const newPrefix = new Settings({
			serverID: message.guild.id,
			prefix: ",,",
			owo: true,
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
		return client.commands.get(`help`).execute(message, [command.name]);
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
				const cdMessage = await message.channel.send(`${message.author.username}, this command is on a cooldown of **${timeLeft.toFixed(2)}s**.`);
				cdMessage.delete(5000);
				message.delete(5000);
				return;
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cdTime);
	}

	if(command.hoard){
		let graphClient = await GraphClient.findOne().catch(err => console.log(err));
		if(!graphClient){
			graphClient = new GraphClient({
				totalGraphers: 0
			});
		}

		let graphUser = await GraphUser.findOne({userID: message.author.id}).catch(err => console.log(err));
		if(!graphUser){
			graphUser = new GraphUser({
				userID: message.author.id,
				graphID: graphClient.totalGraphers,
				node: graphClient.totalGraphers,
				energy: 6
			});
			await graphUser.save().catch(err => console.log(err));
			graphClient.totalGraphers++;

			let embed = new Discord.RichEmbed()
			.setAuthor(`**${message.author.username}**, welcome to the graph arena! Here are your details:`, message.author.displayAvatarURL)
			.setColor('ORANGE')
			.setDescription(`You can always check your details with \`${prefix}profile\``)

			message.channel.send(embed);
		}
		await graphClient.save().catch(err => console.log(err));
	}

	try{
		command.execute(message, args, prefix);
	}
	catch(err){
		console.log(err);
		client.channels.get(consoleID).send(err.message);
		if(message.author.id === dragID)
			return message.reply(`I have some issues here, go check the log ó.=.ò"`)
		else
			return message.reply(`I've encountered some error, tell <@${dragID}> and blame him for that =. .=`);
	}
});

client.login(token);
