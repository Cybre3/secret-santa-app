const { User } = require('../models/userModel');

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

            user = new User({ ...req.body });
            await user.save();

            res.status(201).send(user);
        },
    },
    delete: {}
}