const { User } = require('../models/userModel');
const _ = require('lodash');

module.exports = {
    get: {
        allUsers: async (req, res) => {
            const allUsers = await User.find({});

            res.status(200).send(allUsers);
        }
    },
    post: {
        addNewUser: async (req, res) => {
            const userEntry = req.body;

            let user = await User.findOne({ email: userEntry.email });
            if (user) return res.status(400).send({ msg: `User with email ${user.email} already registered!` });
            // set current group

            user = new User(_.omit(userEntry, ['group', 'role']));
            await user.save();

            res.status(201).send(user);
        },

    },

    patch: {
        setCurrentGroup: async (req, res) => {
            const { group, id } = req.body;

            let user = await User.findById(id);
            if (!user) return res.status(404).send({ msg: `User not found.` });

            user.currentGroup = group;
            await user.save();

            res.status(200).send(user);
        }

    },
    delete: {}
}