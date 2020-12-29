const { User } = require("../users");
const { tokenService } = require("../token");
const { httpErrors } = require("../util");
const mongoose = require("mongoose");
const { config } = require("../config");
const bcrypt = require("bcrypt");
const { userService } = require("../users");

const signupNewUser = async (userBody, errCb) => {
  // first check email exist
  if (await User.isUserExist(userBody.email)) {
    errCb(httpErrors.STATUS_409.status, {
      ...httpErrors.STATUS_409,
      error: "Email already taken",
    });
  } else if (!(await User.isPasswordValid(userBody.pass))) {
    errCb(httpErrors.STATUS_409.status, {
      ...httpErrors.STATUS_409,
      error: "Please Enter Strong Password",
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
        errCb(httpErrors.STATUS_409.status, {
          ...httpErrors.STATUS_409,
          error: validateErr.errors,
        });
      } else {
        const newUser = await User.create(user);
        return await tokenService.generateAuthTokens(newUser);
      }
    } catch (err) {
      errCb(httpErrors.STATUS_500.status, {
        ...httpErrors.STATUS_500,
        message: err,
      });
    }
  }
};

const signInWithEmailPassword = async (email, pass, errCb) => {
  try {
    const user = await userService.getUserByEmail(email);
    if (user) {
      const compare = await bcrypt.compare(pass, user.pass);

      if (compare) {
        await tokenService.deleteAllUserTokens(user._id);
        return await tokenService.generateAuthTokens({ _id: user._id });
      } else {
        errCb(httpErrors.STATUS_401.status, {
          ...httpErrors.STATUS_500,
          message: "Invalid Login",
        });
      }
    } else {
      errCb(httpErrors.STATUS_401.status, {
        ...httpErrors.STATUS_401,
        message: "Invalid Login",
      });
    }
  } catch (err) {
    errCb(httpErrors.STATUS_500.status, {
      ...httpErrors.STATUS_500,
      message: err,
    });
  }
};

const signout = async (token, errCb) => {
  const payload = tokenService.verifyToken(token, "REFRESH", (err) => {
    errCb(httpErrors.STATUS_404.status, httpErrors.STATUS_404);
  });

  if (payload) {
    tokenService.deleteAllUserTokens(payload.user);
    return true;
  }

  return false;
};

module.exports = {
  signupNewUser,
  signInWithEmailPassword,
  signout,
};
