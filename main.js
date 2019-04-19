const fs = require('fs');
const Discord = require('discord.js');
const {Op}= require('sequelize');

const {defaultPrefix,token,bot_name} = require('./config.json');
const {dragID,drag2ID,godID,zsID,botID} = require(`./users.json`);
const {consoleID,messageID,startupID,betastartupID} = require(`./channels.json`);
const {isoAdminID} = require(`./roles.json`);
const trigger = require('./triggers');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldown = new Discord.Collection();

const {Users, CurrencyShop} = require('./dbObjects');
const currency = new Discord.Collection();

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

//define currency properties
Reflect.defineProperty(currency, 'add', {
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 1000;
	},
});

client.once('ready', async () => {
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));

	let startmsg = `*Yawns~* mornin' Evirir...u.=.o\nIt's currently **${client.readyAt}**\n`;
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
	let prefixes = JSON.parse(fs.readFileSync("./prefixes.json","utf8"));

	if(!prefixes[message.guild.id]){
		prefixes[message.guild.id] = {
			prefix: defaultPrefix
		}
		fs.writeFile('./prefixes.json', JSON.stringify(prefixes), (err) => {
			if(err) console.log(err);
		});
		prefixes = JSON.parse(fs.readFileSync("./prefixes.json","utf8"));
	}

	let prefix = prefixes[message.guild.id].prefix;

	if(message.author.bot) return;
	currency.add(message.author.id, 1);
	if(!message.content.startsWith(prefix) && !message.content.startsWith(prefix.toUpperCase())) {
		return trigger.execute(client, message);
	}

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if(!command) return;
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
		if(!currency.get(message.author.id))
			message.channel.send(`<@${message.author.id}>, welcome to the game! Since you're a new hoarder, you get **${currency.getBalance(message.author.id)}**!`);

		if(command.hoard) command.execute(currency, message, args);
		else command.execute(message, args, prefix);
	}
	catch(error){
		console.error(error);
		client.channels.get(consoleID).send(error);
		if(message.author.id === dragID)
			message.reply(`I have some issues here, go check the log ó.=.ò"`)
		else
			message.reply(`I've encountered some error, tell <@${dragID}> and blame him for that =. .=`);
	}
});

client.login(token);
