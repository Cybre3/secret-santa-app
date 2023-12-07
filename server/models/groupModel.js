const { Schema, model } = require('mongoose');
const makeAllRequired = require('../utilities/makeAllRequired');

const groupSchema = new Schema({
    name: String,
    budget: Number,
    users: Array,
    secretSantas: Array,
    spectators: Array,
    pickPool: Array
});

const GroupModel = model('Group', groupSchema);

function validateGroup(input) {
    const schema = Joi.object({
        name: Joi.string().required(),
        budget: Joi.number().required()
    });

    return schema.validate(input);
}

exports.Group = GroupModel;
exports.validate = validateGroup;


// groups
// group
// id: string
// name: string
// users: []
// secretSantas: []
// spectators: []
// pickPool: []