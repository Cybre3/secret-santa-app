const { Schema, model } = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const makeAllRequired = require('../utilities/makeAllRequired');

const userSchema = new Schema({
    firstname: String,
    email: String,
    password: String,
    groups: {
        type: Array,
        default: []
    },
    admin: Boolean,
    lastSignedIn: String,
});

// makeAllRequired(userSchema);

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, userEmail: this.email, isAdmin: this.admin },
        config.get('jwtPrivateKey') || process.env.jwtPrivateKey,
        { expiresIn: '24h' },
    );
    return token;
};

const UserModel = model('User', userSchema);

function validateUser(input) {
    const schema = Joi.object({
        firstname: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.string().required(),
        group: Joi.string().required()
    });

    return schema.validate(input);
}

exports.User = UserModel;
exports.validate = validateUser;