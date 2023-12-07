const { User } = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports = {
    get: {
        checkUserEmail: async (req, res) => {
            const { email } = req.params;

            let user = await User.findOne({ email });
            if (!user) return res.status(404).send({ msg: `User with email ${user.email} not registered!` });

            res.status(200).send(user);
        },
    },

    post: {
        authenticateUser: async (req, res) => {
            const { email, password } = req.body;

            let user = await User.findOne({ email });
            if (!user) return res.status(404).send({ msg: `User with email ${user.email} not registered!` });

            try {
                const validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) return res.status(400).send('Invalid password.');

                const token = user.generateAuthToken();
                req.token = token;
                await User.updateOne({ email }, { lastSignedIn: new Date().toLocaleString('en-US') });

                res
                    .status(200)
                    .header('x-auth-token', token)
                    .send({
                        msg: "Login Successfull!",
                        _id: user._id,
                        email: user.email,
                        token
                    });
            } catch (error) {
                res.status(400).send('Invalid token.');
            }
        },
    },
    delete: {}
}