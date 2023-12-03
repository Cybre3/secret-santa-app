const config = require('config');

module.exports = function getDB(app) {
    let db;
    const environment = app.get('env');
    const { dbName, host, pass, user } = config.get('db');
    
    switch (environment) {
        case 'production':
            db = `${host}://${process.env[user]}:${process.env[pass]}@${dbName}.x17rekf.mongodb.net/secret-santa?retryWrites=true&w=majority`;
            break;
        case 'test':
            db = 'mongodb://localhost/secret-santa_test';
            break;
        case 'development':
            db = 'mongodb://localhost/secret-santa';
            break;
    }

    return { db, environment };
}