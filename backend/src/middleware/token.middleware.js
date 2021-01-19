const { tokenServices } = require('../services');
const { catchAsync, handleError, ErrorHandler } = require('../_helper');

const refreshToken = catchAsync(async (req, res, next) => {
  try {
    const token = await tokenServices.verifyToken(req.refreshToken, 'REFRESH');
    if (token && token.userId && !token.invalidated) {
      const user = { _id: token.userId };
      const newToken = await tokenServices.generateRefreshToken(user, token);
      res.cookie('auth', newToken, {
        maxAge: newToken.refresh.exp.getTime(),
        httpOnly: true
      });
      req.userId = token.userId;
      next();
    } else {
      handleError(res, new ErrorHandler(401, 'Invalid/Expired Token'));
    }
  } catch (error) {
    handleError(res, error);
  }
});

const isTokenCookieSet = cookie => {
  return (
    cookie &&
    cookie.refresh &&
    cookie.access &&
    cookie.refresh.token &&
    cookie.access.token
  );
};

const isTokenExist = catchAsync(async (req, res, next) => {
  const cookie = req.cookies['auth'];
  if (isTokenCookieSet(cookie)) {
    req.token = cookie;
    next();
  } else {
    handleError(res, new ErrorHandler(401, 'Auth Tokens Required'));
  }
});

const verifyOrRefreshExpiredToken = catchAsync(async (req, res, next) => {
  const cookie = req.cookies['auth'];
  if (isTokenCookieSet(cookie)) {
    try {
      const payload = await tokenServices.verifyToken(
        cookie.access.token,
        'ACCESS'
      );
      req.userId = payload.user;
      next();
    } catch (error) {
      if (error.message && error.message.name === 'TokenExpiredError') {
        req.refreshToken = cookie.refresh.token;
        refreshToken(req, res, next);
      } else {
        handleError(res, error);
      }
    }
  } else {
    handleError(res, new ErrorHandler(401, 'Auth Tokens Required'));
  }
});

module.exports = {
  isTokenExist,
  verifyOrRefreshExpiredToken,
  refreshToken
};
