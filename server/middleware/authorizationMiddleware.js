const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function auth(req, res, next) {
  if (!config.get('requiresAuth')) return next();

  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decodedToken = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decodedToken;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};

export function localVariables(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false
  }
  next();
}