module.exports = {
    name: 'resetuser',
    description: "Resets the bot's username",
    dev: true,
    hidden: true,

    execute(message,args){
        message.client.user.setUsername(`Smaug`);
        message.channel.send(`Username set to \`Smaug\``);
    }
}
