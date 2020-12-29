const { User } = require("../users");
const { tokenService } = require("../token");
const mongoose = require("mongoose");
const { config } = require("../config");
const bcrypt = require("bcrypt");
const { userService } = require("../users");

const signupNewUser = async (userBody, errCb) => {
  // first check email exist
  if (await User.isUserExist(userBody.email)) {
    errCb({ status: 409, message: "Email already taken" });
  } else if (!(await User.isPasswordValid(userBody.pass))) {
    errCb({ status: 409, message: "Please Enter Strong Password" });
  } else {
    //email doesn't exist
    //validate user entered data
    return await register(userBody, "email", errCb);
  }
};

const register = async (userBody, type, errCb) => {
  try {
    let user;
    // throw new Error("ddsds");
    if (type === "email") {
      const hash = await bcrypt.hash(userBody.pass, config.bcrypt.saltRounds);
      user = { ...userBody, pass: hash, accStatus: "active", authType: type };
    } else {
      user = { ...userBody, accStatus: "active", authType: type };
    }

    const validateErr = new User(user).validateSync();
    if (validateErr instanceof mongoose.Error) {
      // Invalid use data
      errCb({ status: 409, message: validateErr.errors });
    } else {
      const newUser = await User.create(user);
      return await tokenService.generateAuthTokens(newUser);
    }
  } catch (err) {
    errCb({ status: 500, message: err });
  }
};

const signInWithEmailPassword = async (email, pass, errCb) => {
  try {
    const user = await userService.getUserByEmail({ email });
    if (user && user.authType === "email") {
      const compare = await bcrypt.compare(pass, user.pass);

      if (compare) {
        await tokenService.deleteAllUserTokens(user._id);
        return await tokenService.generateAuthTokens({ _id: user._id });
      } else {
        errCb({ status: 401, message: "Invalid Login" });
      }
    } else {
      errCb({
        status: 401,
        message: "Invalid Login.Maybe Try login with Google"
      });
    }
  } catch (err) {
    errCb({ status: 500, message: err });
  }
};

const signout = async (userId, errCb) => {
  try {
    await tokenService.deleteAllUserTokens(userId);
  } catch (err) {
    errCb({ status: 500, message: err });
  }
};

const signInWithGoogle = async (payload, errCb) => {
  if (payload && payload.email) {
    const user = await userService.getUserByEmail({ email: payload.email });
    if (user && user.authType === "google") {
      await tokenService.deleteAllUserTokens(user._id);
      return await tokenService.generateAuthTokens(user);
    } else {
      if (user) {
        errCb({ status: 401, message: "Try Different method" });
      } else {
        return await register(
          { email: payload.email, name: payload.name },
          "google",
          errCb
        );
      }
    }
  } else {
    errCb({ status: 401 });
  }
};

module.exports = {
  signupNewUser,
  signInWithEmailPassword,
  signout,
  signInWithGoogle,
};
