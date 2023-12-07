const { User } = require('../models/userModel');
const { Group } = require('../models/groupModel');

module.exports = {
    get: {
        allGroups: async (req, res) => {
            const allGroups = await Group.find({});

            res.status(200).send(allGroups);
        }
    },

    patch: {
        addUserToGroup: async (req, res) => {
            const userInfo = req.body;

            const user = await User.findOne({ email: userInfo.email });
            if (!user) return res.status(404).send({ msg: `User Not found!` });

            const userGroup = await Group.findOne({ name: user.group })

            if (user.role === 'Participant/Secret Santa') {
                userGroup.secretSantas.push(user);
                userGroup.pickPool.push(user);
            } else if (user.role === 'Spectator/Watcher') {
                userGroup.spectators.push(user)
            }
            userGroup.users.push(user);

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
            ;

            group.secretSantas[santaIndex].personToGift = personToGift;
            await group.save();

            res.status(200).send({personToGift, user});
        }
    },

    delete: {

    }
}