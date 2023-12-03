const Mongoose = require('mongoose');
const Winston = require('winston');
const debug = require('debug')('app:db');

const getDB = require('../utilities/getDB');

module.exports = function (app) {
    const { db, environment } = getDB(app);

    Mongoose.set('strictQuery', false);
    Mongoose.connect(db).then(() => {
        if (environment === 'production') Winston.info(`Connected to monogoDB...`) 
        else {
            Winston.info(`Connected to ${db}...`);
            debug(`Connected to ${db}...`);
        }
    })
}