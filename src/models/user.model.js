const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const validator = require('validator')
const userSchema = require('./schemas/user.schema')
const { config, ErrorHandler } = require('../_helper')

userSchema.statics.isUserExist = async email => {
  const user = await User.findOne({ email })
  return !!user
}

userSchema.statics.isPasswordValid = pass => {
  if (pass && pass.length >= 8) {
    return validator.isStrongPassword(pass, config.passwordCheckOptions) > 35
      ? true
      : false
  } else {
    return false
  }
}

userSchema.statics.bcryptPassword = async pass => {
  try {
    return await bcrypt.hash(pass, config.bcrypt.saltRounds)
  } catch (err) {
    throw new ErrorHandler(500, 'Internal Server Error')
  }
}

userSchema.statics.bcryptVerifyPassword = async (pass, dbPass) => {
  try {
    return await bcrypt.compare(pass, dbPass)
  } catch (err) {
    throw new ErrorHandler(500, 'Internal Server Error')
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
