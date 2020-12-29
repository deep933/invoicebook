const filterUser = async user => {
  user.pass = undefined;
  user.__v = undefined;
  user.createdAt = undefined;
  user.updatedAt = undefined;

  return user;
};

module.exports = {
  filterUser
};
