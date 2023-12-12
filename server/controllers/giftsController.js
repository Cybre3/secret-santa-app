const { User } = require('../models/userModel');

module.exports = {
    get: {
        allGifts: async (req, res) => {
            const allGifts = await User.find({});

            res.status(200).send(allGifts);
        }
    },

    patch: {
        addNewGift: async (req, res) => {
            const { gift, userId, groupname } = req.body;

            const user = await User.findById(userId);
            if (!user) return res.status(404).send({ msg: `User not found` });

            const [currentGroup] = user.groups.filter(group => group.name === groupname);
            const currentGroupIndex = user.groups.findIndex(group => group.name === groupname);

            const [giftInSystem] = currentGroup.giftList.filter(giftInList => giftInList.name === gift.name)
            if (giftInSystem) return res.status(400).send({ msg: `Gift already in list. Enter different gift name.` });
            

            user.groups[currentGroupIndex].giftList.push(gift);

            await user.save();

            res.status(201).send({ gift, userId, groupname });
        },
    },

    delete: {}
}