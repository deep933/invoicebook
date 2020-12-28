const userServices = require("./user.service");
const catchAsync = require("../util/catchAsync");
const httpError = require("../util/httperrors");

const createUser = catchAsync(async (req, res) => {
  const token = await userServices.createUser(req.body, (status, err) => {
    res.status(status).send(err);
    res.end();
  });
  res.cookie("auth", token, {
    maxAge: token.refresh.exp.getTime(),
    httpOnly: true,
  });
  res.status(200).send(token);
  res.end();
});

const getUser = catchAsync(async (req, res) => {
  const authTokens = req.cookies["auth"]; // recieve the auth tokens from cookies

  //verify the token & get the user Id
  //else throw Error 401
  if (authTokens.access.token) {
    const user = await userServices.getUser(authTokens, (status, err) => {
      // Something wrong with token or user 
      if(status === httpError.STATUS_401.status){
          res.redirect('/refresh')
      }
      else{
      res.status(status).send(err);
      res.end();
      }
    });
    res.status(200).send(user);
    res.end();
  } else {

    // Token not attched in cookie 404 Unauthorized
    res.status(httpError.STATUS_401.status).send(httpError.STATUS_401);
    res.end();
  }
});

module.exports = {
  createUser,
  getUser,
};
