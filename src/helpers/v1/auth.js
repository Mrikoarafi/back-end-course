const { tokenResult, tokenResultErr, tokenResultExpired, failed } = require('../../helpers/v1/response');
const jwt = require('jsonwebtoken');
const env = require('../../helpers/v1/env');

module.exports = {
  authen: (req, res, next) => {
    const token = req.headers.token;
    if (token === undefined || token === '') {
      tokenResult(res, [], 'Token unknown');
    } else {
      next();
    }
  },
  author: (req, res, next) => {
    const token = req.headers.token;
    jwt.verify(token, env.JWTSECRET_USERS, (err, decoded) => {
      if (err && err.name === 'TokenExpiredError') {
        tokenResultExpired(res, [], 'Token Expired,Authentication failed!');
      } else if (err && err.name === 'JsonWebTokenError') {
        tokenResultErr(res, [], 'Token wrong,Authentication failed!');
      } else {
        next();
      }
    });
  },
  authenAdmin: (req, res, next) => {
    const auth = req.headers.admin;
    if (auth === '1') {
      next();
    } else {
      failed(res, [], 'not admin,logout');
    }
  },
};
