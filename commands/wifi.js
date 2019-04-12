function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}

module.exports = {
	name: 'wifi',
	description: `Plays the wifi game. Each word either has wifi or does not have wifi.\nI would tell you if your word has wifi, but how it's determined...it's your job to figure that out \\o.=.o/`,
	args: true,
	usage: `[word]`,

	execute(message, args){
		var str = args[0];
        var s = str.toLowerCase();
        const n = s.length;
        var hasWifi = true;
        var occ = new Array(26);
        occ.fill(0);

        for(var i=0;i<s.length;i++){
            if(!isLetter(str[i]))
                return message.channel.send(`Please input a valid word! Words must only consist of English alphabets.`);
            if(i > 25) return message.channel.send(`**` + str + `** does NOT have wifi.`);
            occ[s.charCodeAt(i)-97]++;
        }

        for(var i=0;i<26;i++){
            if(occ[i] > 1){
                hasWifi=false;
                break;
            }
        }

        if(hasWifi)     message.channel.send(`**` + str + `** has wifi. More words?`);
        else            message.channel.send(`**` + str + `** does NOT have wifi. More words?`);
  	}
};
