const tokenService = require("./token.service");
const {catchAsync,httpErrors} = require("../util");

const refreshToken = catchAsync(async (req, res) => {
  if (req.cookies["auth"] && req.cookies["auth"].refresh.token) {
    const token = await tokenService.verifyToken(
      req.cookies["auth"].refresh.token,
      "REFRESH",
      err => {
        res
          .status(httpErrors.STATUS_401.status)
          .send({ ...httpErrors.STATUS_401, message: err });
      }
    );

    if (token && token.userId && !token.invalidated) {
      const newToken = await tokenService.generateRefreshToken(
        { _id: token.userId },
        token
      );
      res.cookie("auth", newToken, {
        maxAge: newToken.refresh.exp.getTime(),
        httpOnly: true
      });
      res.status(200).send({ refreshed: true, _id: token.userId });
      res.end();
    } else {
      res
        .status(httpErrors.STATUS_401.status)
        .send({ ...httpErrors.STATUS_401, message: "Invalid/Expired Token" });
      res.end();
    }
  } else {
    res.status(httpErrors.STATUS_401.status).send(httpErrors.STATUS_401);
    res.end();
  }
});

module.exports = {
  refreshToken
};
