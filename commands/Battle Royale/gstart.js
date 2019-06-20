const Discord = require('discord.js');
const GameGraph = require('../../models/gameGraph.js');

module.exports = {
    name: 'gstart',
    description: 'Starts a classical game of graph theory battle royale.',

    async execute(message, args, prefix) {
        let inviteMsg = message.channel.send(`A new game has been started by <@${message.author.id}>! React in 60s to join!\n(The host can use \`${prefix}gcancel\` to cancel the game)`);
        await inviteMsg.react('✅');

        const rCollector = message.createReactionCollector(e => e.emoji.name === '✅', {time: 30000});
        const mCollector = message.channel.createReactionCollector(m => m.author === message.author, {time: 30000});

        let cancelled = false;
        mCollector.on('collect', m => {
            if(m.content === `${prefix}gcancel`){
                message.channel.send(`Game cancelled u.=.u`);
                cancelled = true;
                mCollector.stop();
            }
        });

        const players = [];
        rCollector.on('end', async collected => {
            if(cancelled) return;

            const gameGraph = new GameGraph({
                channelID: message.channel.id,
                nodeCount: collected.size - 1,
            });

            for(let i = 0; i < collected.users.size; i++){
                const u = collected.users[i];
                if(u === message.client.user) continue;
                gameGraph.players.push(u.username);
                gameGraph.adj.push([]);
                gameGraph.userLocations.push({
                    id: u.id,
                    node: i
                });
                gameGraph.nodeUsers.push({
                    node: i,
                    users: [u.id]
                });

                gameGraph.userProfiles.push({
                    userID: u.id,
                    money: 100,
                    energy: 6,
                    hp: 100,
                    kills: 0,
                    deaths: 0,
                    inventory: []
                });
                gameGraph.markModified(userProfiles.inventory);
            }

            await gameGraph.save().catch(err => console.log(err));

            message.channel.send(`${collected.size - 1} players joined!\n**${players.join('\n')}**`);
        });
    }
};
