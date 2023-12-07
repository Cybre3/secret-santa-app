const { Group } = require('./models/groupModel');

module.exports = function seedInfo(app) {
    
}

async function addGroup(app) {
    const group = {
        name: 'Family Secret Santa 2023',
        budget: 25
    };

    await Group.insertMany(group);

    console.log('group saved!');
}

