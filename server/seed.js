const { add } = require('lodash');
const { Group } = require('./models/groupModel');
const { User } = require('./models/userModel');

module.exports = function seedInfo(app) {
    // reset(app);
}

async function addGroup(app) {
    const group = {
        name: 'Family Secret Santa 2023',
        budget: 25
    };

    await Group.deleteMany({})
    await Group.insertMany(group);

    console.log('group saved!');
}

async function removeUsers(app) {
    await User.deleteMany({});

    console.log('users removed!')
}

function reset(app) {
    addGroup(app);
    removeUsers(app);
}