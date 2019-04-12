module.exports = {
	name: 'argsinfo',
	description: `Displays number of arguments you gave`,
	args: true,
	usage: '[arg1] [arg2]...',

	execute(message, args) {
		if(args[0]==='hrrr')
			message.channel.send('Secret found! o.=.o');
		else
			message.channel.send(`No of args: ${args.length}`);
	}
};
