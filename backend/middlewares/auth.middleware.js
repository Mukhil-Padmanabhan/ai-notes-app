const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { sendUnauthorized } = require('../utils/response');
const { NO_TOKEN, EXIPRED_TOKEN } = require('../constants/auth');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
  return sendUnauthorized(res, NO_TOKEN);

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return sendUnauthorized(res, EXIPRED_TOKEN);
  }
};

module.exports = { verifyToken };
