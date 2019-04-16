module.exports = {
    name: 'resetuser',
    admin: true,
    hidden: true,

    execute(message,args){
        message.client.user.setUsername(`Smaug`);
        message.channel.send(`Username set to \`Smaug\``);
    }
}
