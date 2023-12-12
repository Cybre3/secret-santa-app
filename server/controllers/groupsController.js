const { User } = require('../models/userModel');
const { Group } = require('../models/groupModel');
const _ = require('lodash');

module.exports = {
    get: {
        allGroups: async (req, res) => {
            const allGroups = await Group.find({});

            res.status(200).send(allGroups);
        }
    },

    patch: {
        addUserToGroup: async (req, res) => {
            const userEntry = req.body;
            const { group: groupname } = req.params;
            const UserOmittedValues = _.pick(userEntry, ['firstname', 'email']);

            const user = await User.findOne({ email: userEntry.email });
            if (!user) return res.status(404).send({ msg: `User Not found!` });

            const userGroup = await Group.findOne({ name: groupname });
            if (!userGroup) return res.status(404).send('Group not found.')

            user.groups = [];
            user.groups.push({ name: userEntry.group, role: userEntry.role, giftList: [], active: true });

            if (userEntry.role === 'Participant/Secret Santa') {
                userGroup.secretSantas.push(UserOmittedValues);
                userGroup.pickPool.push(UserOmittedValues);
            } else if (userEntry.role === 'Spectator/Watcher') {
                userGroup.spectators.push(UserOmittedValues)
            }
            userGroup.users.push(UserOmittedValues);


            await user.save();
            await userGroup.save();

            res.status(201).send({ userGroup, user });
        },

        removePersonById: async (req, res) => {
            const { group: groupname, _id, email } = req.body;

            let group = await Group.findOne({ name: groupname });
            if (!group) return res.status(404).send('Group not found.')

            const filtered = group.pickPool.filter(person => person.email !== email)

            group.pickPool = filtered;
            await group.save()

            res.status(200).send(req.body);
        },

        assignPersonToUser: async (req, res) => {
            const { group: groupname, _id } = req.params;
            const { user, personToGift } = req.body;

            let group = await Group.findOne({ name: groupname });
            if (!group) return res.status(404).send('Group not found.')

            const santaIndex = group.secretSantas.findIndex(santa => santa.email === user.email);

            group.secretSantas[santaIndex].personToGift = personToGift;
            const saved = await group.save();

            res.status(200).send(saved);
            // res.status(200).send({personToGift, user});
        }
    },

    delete: {

    }
}