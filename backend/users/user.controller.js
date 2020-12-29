const userServices = require("./user.service");
const {catchAsync,httpErrors,filter} = require("../util");


const getUser = catchAsync(async (req, res, next) => {
  const authTokens = req.cookies["auth"]; // recieve the auth tokens from cookies
  //verify the token & get the user Id
  //else throw Error 401
  if (authTokens && authTokens.access && authTokens.access.token) {
    const user = await userServices.getUser(authTokens, (status, err) => {
      // Something wrong with token or user
      if (status === httpErrors.STATUS_401.status) {
        res.redirect("/auth/refresh");
        res.end();
      } else {
        res.status(status).send(err);
        res.end();
      }
    });
    if (user) {
      res.status(200).send(await filter.filterUser(user));
      res.end();
    }
  } else {
    // Token not attched in cookie 404 Unauthorized
    res.status(httpErrors.STATUS_401.status).send(httpError.STATUS_401);
    res.end();
  }
});

module.exports = {
  getUser
};
