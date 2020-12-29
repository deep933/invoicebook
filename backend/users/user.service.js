const User = require("./user.model");

const getUser = async (userId, errCb) => {
  try {
    // if token validated successfuly --> find the user by Id
    const user = await User.findOne({ _id: userId });
    if (!user) {
      errCb({status:404,message:"User not found"});
    }
    return user;
  } catch (err) {
    errCb({status:500,message:err});
  }
};

const getUserByEmail = async (email) => {
  return await User.findOne(email);
};

module.exports = {
  getUser,
  getUserByEmail,
};
