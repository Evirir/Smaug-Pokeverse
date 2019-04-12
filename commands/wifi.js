function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}

module.exports = {
	name: 'wifi',
	description: `Plays the wifi game. Each word either has wifi or does not have wifi. I would tell you if your word has wifi, but how it's determined...it's your job to figure that out \\o.=.o/`,
	args: true,
	usage: `[word]`,

	execute(message, args){
		const s = args[0];
        const n = s.length;
        var hasWifi = true;
        var occ = new Array(26);
        occ.fill(0);

        if(s.length > 26) return message.channel.send(`**` + s + `** does NOT have wifi.`);

        for(var i=0;i<s.length;i++){
            if(!isLetter(s[i]))
                return message.channel.send(`Please input a valid word! Words must only consist of English alphabets.`);
            s[i] = s[i].toLowerCase();
            occ[s[i]-'A']++;
        }

        for(var i=0;i<26;i++){
            if(occ[i] > 1){
                hasWifi=false;
                break;
            }
        }

        if(hasWifi)     message.channel.send(`**` + word + `** has wifi.`);
        else            message.channel.send(`**` + word + `** does NOT have wifi.`);
  	}
};
