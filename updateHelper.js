const fs = require('fs');

module.exports = {
    update(obj) {
        fs.writeFile('./arenaData/UserInv.json', JSON.stringify(obj), (err) => {
            if(err) console.log(err);
        });
    }
};
