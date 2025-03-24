const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt');
const logger = require('../utils/logger');
const { USER_EXISTS, REGISTRATION_ERROR, INVALID_CREDENTIALS, LOGIN_ERROR, LOGIN_SUCCESS, REGISTRATION_SUCCESS } = require('../constants/auth');
const { sendSuccess, sendError, sendUnauthorized } = require('../utils/response');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.info(`Registration failed: User already exists - ${email}`);
      return sendError(res, 409, USER_EXISTS);
    }

    const user = await User.create({ email, password });
    const token = generateToken(user._id);

    logger.info(`User registered: ${email}`);
    return sendSuccess(res, 201, {
      _id: user._id,
      email: user.email,
      token,
    }, REGISTRATION_SUCCESS);
  } catch (err) {
    logger.error(`${REGISTRATION_ERROR}: ${err.message}`, { stack: err.stack });
    return sendError(res, 500, REGISTRATION_ERROR);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      logger.warn(`Invalid login attempt for ${email}`);
      return sendUnauthorized(res, INVALID_CREDENTIALS);
    }

    const token = generateToken(user._id);

    logger.info(`User logged in: ${email}`);
    return sendSuccess(res, 200,{
      _id: user._id,
      email: user.email,
      token,
    }, LOGIN_SUCCESS);
  } catch (err) {
    logger.error(`Login error: ${err.message}`, { stack: err.stack });
    return sendError(res, 500, LOGIN_ERROR);
  }
};