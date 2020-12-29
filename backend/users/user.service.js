const User = require("./user.model");
const { tokenService } = require("../token");
const { httpErrors } = require("../util");

const getUser = async (tokens, errCb) => {
  //first need to validate the token
  const payload = await tokenService.verifyToken(
    tokens.access.token,
    "ACCESS",
    (err) => {
      errCb(httpErrors.STATUS_401.status, {
        ...httpErrors.STATUS_401,
        error: err,
      });
    }
  );

  if (payload) {
    try {
      // if token validated successfuly --> find the user by Id
      const user = await User.findOne({ _id: payload.user });
      if (!user) {
        errCb(httpErrors.STATUS_404.status, {
          ...httpErrors.STATUS_404,
          error: "User not found",
        });
      }
      return user;
    } catch (err) {
      errCb(httpErrors.STATUS_500.status, httpErrors.STATUS_500);
    }
  }
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

module.exports = {
  getUser,
  getUserByEmail,
};
