const Winston = require('winston');

module.exports = function(err, req, res, next) {
  const errorLogger = Winston.loggers.get('errors');

  errorLogger.error({
    message: err.message,
    metadata: err.stack,
    timestamp: Winston.format.timestamp(new Date()).options
  });

  return res.status(500).send('Something Failed.');
}