const User = require("./user.model");
const tokenService = require("../token/token.service");
const { use } = require("./user.route");
const httperrors = require("../util/httperrors");

const createUser = async (userBody, errCb) => {
  if (await User.isUserExist(userBody.email)) {
    errCb(httperrors.STATUS_409.status, {
      ...httperrors.STATUS_409,
      error: "Email already taken",
    });
  }
  const user = await User.create(userBody);
  if (!user) {
    errCb(httperrors.STATUS_500.status, httperrors.STATUS_500);
  }
  return await tokenService.generateAuthTokens(user);
};

const getUser = async (tokens, errCb) => {
  const payload = await tokenService.verifyToken(
    tokens.access.token,
    "ACCESS",
    (err) => {
      errCb(httperrors.STATUS_401.status, {
        ...httperrors.STATUS_401,
        error: err,
      });
    }
  );
  if (payload) {
    try {
      const user = await User.findOne({ _id: payload.user });
      if (!user) {
        errCb(httperrors.STATUS_404.status, {
          ...httperrors.STATUS_404,
          error: "User not found",
        });
      }
      return user;
    } catch (err) {
      errCb(httperrors.STATUS_500.status, httperrors.STATUS_500);
    }
  }
};

module.exports = {
  createUser,
  getUser,
};
