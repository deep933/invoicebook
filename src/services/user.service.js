const { User } = require('../models')
const { ErrorHandler } = require('../_helper')

const getUser = async userId => {
  try {
    const user = await User.findOne({ _id: userId })
    if (!user) {
      throw new ErrorHandler(404, 'User not found!')
    }
    return user
  } catch (err) {
    throw err
  }
}

const getUserByEmail = async email => {
  try {
    return await User.findOne(email)
  } catch (error) {
    throw error
  }
}

module.exports = {
  getUser,
  getUserByEmail
}
