const {isoBotsID,isoboxbotID,consoleID} = require(`../channels.json`);

function commafy(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
    name: 'fakecf',
    description: 'Sends a fake coinflip result message (For trolling in BoxBot)',
    args: true,
    usage: '[channelID/name] [@user/userID] [original amount] [cf amount] [win/lose]',
    notes: `Usable names: isobots, isoboxbot, console`,

    execute(message, args){
        if(args.length < 5) return message.reply(`please specify all arguments!`);

        let tgtChannel = "";
        if(message.mentions.channels.size){
            tgtChannel = message.mentions.channels.first().id;
            tgtChannel = tgtChannel.substring(2,tgtChannel.length-1);
        }
        else{
            const chID = args[0];
            const chName = chID.toLowerCase();
            if(chName === `isobots`)            tgtChannel = isoBotsID;
            else if(chName === `isoboxbot`)	    tgtChannel = isoboxbotID;
            else if(chName === `console`)	    tgtChannel = consoleID;
            else                                tgtChannel = chID;
        }

        let tgtUser = "";
        if(message.mentions.users.size){
            tgtUser = message.mentions.users.first().id;
        }
        else{
            tgtUser = args[1];
        }

        try{
            const oriAmount = parseFloat(args[2]);
            const cfAmount = parseFloat(args[3]);
            const resultRaw = args[4].toLowerCase();

            let result = "";
            let change = 0;
            if(resultRaw === 'lose' || resultRaw === 'lost' || resultRaw === 'loss'){
                result = 'You **LOST**';
                change = -cfAmount;
            }
            else if(resultRaw === 'win' || resultRaw === 'won'){
                result = 'Congratulations! You **WON**';
                change = cfAmount;
            }

            if(cfAmount < 1000)
                return message.channel.send(`<@${message.author.id}> -> The minimum amount you can "gamble" is **$1,000.00!**`);
            if(cfAmount > oriAmount)
                return message.reply(`I could try that, but the bet is larger than the original amount...and it'll be quite fake to everyone.`);

            let msg = "";
            msg += `<@${tgtUser}> -> You gained ⭐ **${Math.floor(cfAmount/1000)} EXP** from this coinflip.`;
            msg += `\n\n${result} **$${commafy(cfAmount.toFixed(2))}** and now have a total of **$${commafy((oriAmount + change).toFixed(2))}**.`;

            let oriUser = message.guild.member(message.client.user).nickname;
            message.guild.member(message.client.user).setNickname('BoxBot')
            .then(() => message.client.channels.get(tgtChannel).send(msg))
            .then(() => message.guild.member(message.client.user).setNickname(oriUser))
            .then(() => message.channel.send("***Victim found!***"));
        }
        catch(error){
            message.reply('invalid channel! (Or I encountered an error)');
            console.log(error);
        }
    }
}
