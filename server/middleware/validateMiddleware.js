require('dotenv').config();
const config = require('config');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { Console, File, MongoDB } = transports;
const { combine, label, prettyPrint, colorize, timestamp, printf } = format;
require('winston-mongodb');


module.exports = (validator) => {
  return (req, res, next) => {
    const { error, value } = validator(req.body);

    context = '';

    if (error) {
      const errorDataObj = formatError(req, error);
      logResponseError(errorDataObj);
      return res.status(400).send(error.details[0].message);
    }

    next();
  };

  function logResponseError(errorDataObj) {
    let db;
    const environment = config.get('env');
    const { dbName, host, pass, user } = config.get('db');

    switch (environment) {
      case 'production':
        db = `${host}://${process.env[user]}:${process.env[pass]}@${dbName}.x17rekf.mongodb.net/secret-santa?retryWrites=true&w=majority`;
        break;
      case 'test':
        db = 'mongodb://localhost/secret-santa_test';
        break;
      case 'development':
        db = 'mongodb://localhost/secret-santa_test';
        break;
    }

    const myResFormat = printf(({ level, label, timestamp, ...meta }) => {
      return `\n--- ${label} ${level} ---\n[${timestamp}] ${level} ${JSON.stringify(
        meta
      )}\n--- ${label} ${level} ---\n`;
    });

    const logger = createLogger({
      format: combine(
        label({ label: 'response' }),
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
        prettyPrint(),
        myResFormat
      ),
      transports: [
        new transports.Console({ format: combine(colorize(), prettyPrint(), myResFormat) }),
        new transports.File({
          filename: 'logs/responses.log',
        }),
        new transports.MongoDB({
          db,
          dbName: 'secret-santa',
          options: { useUnifiedTopology: true },
          storeHost: true,
          collection: 'secret-santa_logs',
          label: 'response',
        }),
      ],
    });

    logger.error(errorDataObj);
  }

  function formatError(req, error) {
    for (let pathIndex in error.details[0].context) {
      if (pathIndex === 'label') context += '{\n\t';
      if (pathIndex === 'key') {
        context += `${pathIndex}: ${error.details[0].context[pathIndex]}`;
        context += '\n }';
      } else context += `${pathIndex}: ${error.details[0].context[pathIndex]},\n\t`;
    }

    const { route, method, originalUrl } = req;
    const { name: component } = route.stack[1];
    const errorDataObj = {
      path: error.details[0].path,
      error: error.details[0].message,
      context,
      fileTrace: path.resolve(__filename),
      requestTrace: `${method} ${originalUrl} - ${component}`,
    };

    return errorDataObj;
  }
};
