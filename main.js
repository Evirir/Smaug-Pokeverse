const fs = require('fs');
const Discord = require('discord.js');
const {prefix,token} = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldown = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
	const command = require(`./commands/${file}`);
	client.commands.set(command.name,command);
}


client.once('ready', () => {
	console.log("*Yawns~* mornin'");
});

client.on('message', message => {
	if(!message.content.startsWith(prefix) && !message.content.startsWith(prefix.toUpperCase())) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if(!command) return;
	
	if(command.args && command.usage && !args.length()){
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
		message.reply(`I've encountered some error, tell my owner and blame him for that =. .=`);
	}
});

client.login(token);
