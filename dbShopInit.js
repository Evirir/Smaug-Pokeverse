const fs = require('fs');

const Shop = [];

Shop.push({
    name: 'EnergyDrink',
    description: 'Increases your energy by 6',
    cost: 1000,
    energyCost: 0,
});

Shop.push({
    name: 'EnergyDrink2',
    description: 'Increases your energy by 12',
    cost: 2000,
    energyCost: 0,
});

fs.writeFile('./arenaData/ShopItems.json', JSON.stringify(Shop), (err) => {
    if(err) console.log(err);
})
