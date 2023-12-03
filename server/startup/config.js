const config = require('config');
const Winston = require('winston')

module.exports = function () {
    Winston.info(`Application Name: ${config.get('name')}`);
}