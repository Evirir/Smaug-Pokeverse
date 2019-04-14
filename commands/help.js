const {prefix} = require(`../config.json`);
const {dragTag} = require(`../users.json`);

module.exports = {
	name: 'help',
	description: `Shows list of spells that I know. Use \`${prefix}help [spell]\` to view details of the spell.\n(Also, nice job on getting help on a help command)`,
	aliases: ['commands','command','cmd'],
	usage: '[spell-name]',

	execute(message, args){
		const data = [];
		const {commands} = message.client;

		var cmd = commands.map(command => command);
		var stdcmd = [];
		var dragcmd = [];
		for(var i=0;i<cmd.length;i++){
			if(!cmd[i].hidden){
				if(cmd[i].admin) dragcmd.push(cmd[i].name);
				else stdcmd.push(cmd[i].name);
			}
		}

		if(!args.length){
			data.push(`Hey, I'm Smaug the dragon! My current prefix is \`${prefix}\``);
			data.push(`Here are all the magic spells that I know:\n\n**Standard commands:**\n\``);
			data.push(stdcmd.join(', '));
			data.push(`\`\n\n**Developer commands:**\n\``);
			data.push(dragcmd.join(', '));
			data.push(`\`\n\nSend \`${prefix}help [command]\` for more info on that spell!`);
			data.push(`DM **@${dragTag}** if you want to see the source code of this bot.`);

			return message.channel.send(data, {split: true});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if(!command)
			return message.reply("すみません, I've never heard of this spell...maybe it's in the grand book of magic which I'm lazy to read.");
		if(command.hidden)
			return message.reply("すみません, I've never heard of this spell...maybe");

		data.push(`**Name:** \`${command.name}\``);
		if(command.aliases) 	data.push(`**Aliases:** \`${command.aliases.join('`, `')}\``);
		if(command.description) data.push(`**Description:** ${command.description}`);
		if(command.usage) 		data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);

		message.channel.send(data,{split: true});
	}
};
