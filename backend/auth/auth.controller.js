const authServices = require("./auth.service");
const catchAsync = require("../util/catchAsync");

const signup = catchAsync(async (req, res) => {
  const token = await authServices.signupNewUser(req.body, (status, err) => {
    res.status(status).send(err);
    res.end();
  });
  if (token) {
    res.cookie("auth", token, {
      maxAge: token.refresh.exp.getTime(),
      httpOnly: true
    });
    res.status(200).send(token);
    res.end();
  }
});

const signin = catchAsync(async (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;
});

module.exports = {
  signup,
  signin
};
