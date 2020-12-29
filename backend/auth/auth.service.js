const User = require("../users/user.model");
const tokenService = require("../token/token.service");
const httperrors = require("../util/httperrors");
const mongoose = require("mongoose");
const config = require("../config/config");
const bcrypt = require("bcrypt");

const signupNewUser = async (userBody, errCb) => {
  // first check email exist
  if (await User.isUserExist(userBody.email)) {
    errCb(httperrors.STATUS_409.status, {
      ...httperrors.STATUS_409,
      error: "Email already taken"
    });
  } else if (!(await User.isPasswordValid(userBody.pass))) {
    errCb(httperrors.STATUS_409.status, {
      ...httperrors.STATUS_409,
      error: "Please Enter Strong Password"
    });
  } else {
    //email doesn't exist
    //validate user entered data
    try {
      // throw new Error("ddsds");

      const hash = await bcrypt.hash(userBody.pass, config.bcrypt.saltRounds);
      const user = { ...userBody, pass: hash };
      const validateErr = new User(user).validateSync();
      if (validateErr instanceof mongoose.Error) {
        // Invalid use data
        errCb(httperrors.STATUS_409.status, {
          ...httperrors.STATUS_409,
          error: validateErr.errors
        });
      } else {
        const newUser = await User.create(user);
        return await tokenService.generateAuthTokens(newUser);
      }
    } catch (err) {
      errCb(httperrors.STATUS_500.status, {
        ...httperrors.STATUS_500,
        message: err
      });
    }
  }
};

module.exports = {
  signupNewUser
};
