const {prefix} = require(`../config.json`);

module.exports = {
	name: 'help',
	description: 'Shows list of spells that I know',
	aliases: ['commands','command','cmd'],
	usage: '[spell-name]',

	execute(message, args){
		const data = [];
		const {commands} = message.client;

		if(!args.length){
			data.push(`Hey, I'm Smaug the dragon! My current prefix is \`${prefix}\``);
			data.push(`Here are all the magic spells that I know:\n\``);
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\`\n\nSend \`${prefix}help [command]\` for more info on that spell!`);

			return message.channel.send(data, {split: true});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if(!command){
			return message.reply("すみません, I've never heard of this spell...perhaps it's in the grand book of magic...?");
		}

		data.push(`**Name:** \`${command.name}\``);
		if(command.aliases) 	data.push(`**Aliases:** \`${command.aliases.join('`, `')}\``);
		if(command.description) data.push(`**Description:** ${command.description}`);
		if(command.usage) 		data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);

		message.channel.send(data,{split: true});
	}
};
