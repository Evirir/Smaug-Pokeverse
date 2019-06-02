function isLetter(c) {
  const alp = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  if(alp.includes(c)) return true;
  return false;
}

module.exports = {
	name: 'wifi',
	description: `Plays the wifi game. Each word either has wifi or does not have wifi.\nI would tell you if your word has wifi, but how it's determined...it's your job to figure that out \\o.=.o/`,
	args: true,
	usage: `[word]`,
    cd: 5,

	async execute(message, args){
        var msg = "";
        if(args.length > 1){
            msg += `Only the first word will be considered!\n`;
        }

		var str = args[0];
        var s = str.toLowerCase();
        const n = s.length;
        var hasWifi = true;
        var occ = new Array(26);
        occ.fill(0);

        for(var i=0; i<s.length; i++){
            if(!isLetter(str[i].toLowerCase()))
                return message.channel.send(`Please input a valid word! Words must only consist of English alphabets.`);
            if(i > 25){
                msg += (`**` + str + `** does NOT have wifi.`);
                return message.channel.send(msg);
            }
            occ[s.charCodeAt(i)-97]++;
        }

        for(var i=0; i<26; i++){
            if(occ[i] > 1){
                hasWifi=false;
                break;
            }
        }

        if(hasWifi)     msg += (`**` + str + `** has wifi. More words?`);
        else            msg += (`**` + str + `** does NOT have wifi. More words?`);

        const sentMessage = await message.channel.send(msg);
        sentMessage.delete(5000);
        message.delete(5000);
  	}
};
