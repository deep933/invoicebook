const mongoose = require('mongoose');
const { ErrorHandler } = require('../_helper/error');
const { userServices, tokenServices } = require('./');
const { User } = require('../models');

const signupNewUser = async userBody => {
  try {
    if (await User.isUserExist(userBody.email)) {
      throw new ErrorHandler(409, 'Email already taken');
    } else if (!(await User.isPasswordValid(userBody.pass))) {
      throw new ErrorHandler(409, 'Please Enter Strong Password');
    } else {
      return await register(userBody, 'email');
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const register = async (userBody, signUpMethod) => {
  try {
    const user =
      signUpMethod === 'email'
        ? {
            ...userBody,
            pass: await User.bcryptPassword(userBody.pass),
            accStatus: 'active',
            authType: signUpMethod
          }
        : { ...userBody, accStatus: 'active', authType: signUpMethod };

    const validateErr = new User(user).validateSync();

    if (validateErr instanceof mongoose.Error) {
      throw new ErrorHandler(409, validateErr.errors);
    } else {
      const newUser = await User.create(user);
      return await tokenServices.generateAuthTokens(newUser);
    }
  } catch (error) {
    throw error;
  }
};

const signInWithEmailPassword = async (email, pass) => {
  try {
    const user = await userServices.getUserByEmail({ email });
    if (user && user.authType === 'email') {
      if (await User.bcryptVerifyPassword(pass, user.pass)) {
        await tokenServices.deleteAllUserTokens(user._id);
        return await tokenServices.generateAuthTokens({ _id: user._id });
      } else {
        throw new ErrorHandler(401, 'Invalid Login');
      }
    } else {
      throw new ErrorHandler(401, 'Invalid Login.Maybe Try login with Google');
    }
  } catch (error) {
    throw error;
  }
};

const signout = async (userId, errCb) => {
  try {
    await tokenServices.deleteAllUserTokens(userId);
  } catch (error) {
    throw error;
  }
};

const signInWithGoogle = async payload => {
  if (payload && payload.email) {
    const user = await userService.getUserByEmail({ email: payload.email });
    if (user && user.authType === 'google') {
      await tokenService.deleteAllUserTokens(user._id);
      return await tokenService.generateAuthTokens(user);
    } else {
      if (user) {
        throw new ErrorHandler(401, 'Try Different method');
      } else {
        return await register(
          { email: payload.email, name: payload.name },
          'google'
        );
      }
    }
  } else {
    throw new ErrorHandler(401, 'Unauthorized Access');
  }
};

module.exports = {
  signupNewUser,
  signInWithEmailPassword,
  signout,
  signInWithGoogle
};
