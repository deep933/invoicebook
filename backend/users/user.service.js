const User = require('./user.model')
const tokenService = require('../util/token.service');
const { use } = require('./user.route');

const createUser = async (userBody) => {
    if (await User.isUserExist(userBody.email)) {

      throw new Error('Email already taken');
    }
    const user = await User.create(userBody);
    return await tokenService.generateToken(user);
};

module.exports = {
    createUser
}