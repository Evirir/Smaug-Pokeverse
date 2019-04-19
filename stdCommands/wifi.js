function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}

module.exports = {
	name: 'wifi',
	description: `Plays the wifi game. Each word either has wifi or does not have wifi.\nI would tell you if your word has wifi, but how it's determined...it's your job to figure that out \\o.=.o/`,
	args: true,
	usage: `[word]`,

	execute(message, args){
        var msg = "";
        if(args.length > 1){
            msg += `<@${message.author.id}>, only the first word will be considered!\n`;
        }

		var str = args[0];
        var s = str.toLowerCase();
        const n = s.length;
        var hasWifi = true;
        var occ = new Array(26);
        occ.fill(0);

        for(var i=0;i<s.length;i++){
            if(!isLetter(str[i]))
                return msg += (`Please input a valid word! Words must only consist of English alphabets.`);
            if(i > 25){
                msg += (`**` + str + `** does NOT have wifi.`);
                return message.channel.send(msg);
            }
            occ[s.charCodeAt(i)-97]++;
        }

        for(var i=0;i<26;i++){
            if(occ[i] > 1){
                hasWifi=false;
                break;
            }
        }

        if(hasWifi)     msg += (`**` + str + `** has wifi. More words?`);
        else            msg += (`**` + str + `** does NOT have wifi. More words?`);
        message.channel.send(msg);
  	}
};
