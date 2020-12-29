const User = require("./user.model");
const tokenService = require("../token/token.service");
const httperrors = require("../util/httperrors");

const getUser = async (tokens, errCb) => {
  const payload = await tokenService.verifyToken(
    tokens.access.token,
    "ACCESS",
    err => {
      errCb(httperrors.STATUS_401.status, {
        ...httperrors.STATUS_401,
        error: err
      });
    }
  );
  if (payload) {
    try {
      const user = await User.findOne({ _id: payload.user });
      if (!user) {
        errCb(httperrors.STATUS_404.status, {
          ...httperrors.STATUS_404,
          error: "User not found"
        });
      }
      return user;
    } catch (err) {
      errCb(httperrors.STATUS_500.status, httperrors.STATUS_500);
    }
  }
};

module.exports = {
  getUser
};
