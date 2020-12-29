const authServices = require("./auth.service");
const { catchAsync, errorHandler } = require("../util");
const tokenService = require("../token/token.service");

const signup = catchAsync(async (req, res) => {
  const token = await authServices.signupNewUser(req.body, async (err) => {
    await errorHandler(res, err)
  });
  if (token) {
    res.cookie("auth", token, {
      maxAge: token.refresh.exp.getTime(),
      httpOnly: true,
    });
    res.status(200).json(token);
    res.end();
  }
});

const signin = catchAsync(async (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;

  if (email && pass) {
    const token = await authServices.signInWithEmailPassword(
      email,
      pass,
      async (err) => {
        await errorHandler(res, err)
      }
    );
    if (token) {
      res.cookie("auth", token, {
        maxAge: token.refresh.exp.getTime(),
        httpOnly: true,
      });
      res.status(200).json({ success: true })
      res.end();
    }
  } else {
    await errorHandler(res, { status: 401, message: "Required Email & Password" })
  }
});

const signout = catchAsync(async (req, res) => {
  if (req.userId) {
    const signout = await authServices.signout(req.userId, async (err) => {
      await errorHandler(res, err);
    });

    if (signout) {
      res.cookie("auth", {
        maxAge: 0,
      });
      res.status(201).json({ success: true }).end();
    }
  } else {
    await errorHandler(res, { status: 404 });
  }
});

const googleSignIn = catchAsync(async (req, res) => {
  if (req.body.token) {
    const payload = await tokenService.verifyGoogleAuthToken(
      req.body.token,
      async (err) => {
        await errorHandler(res, err);
      }
    );
    const token = await authServices.signInWithGoogle(payload, async (err) => {
      await errorHandler(res, err);
    });

    res.cookie("auth", token, {
      maxAge: token.refresh.exp.getTime(),
      httpOnly: true,
    });
    res.status(201).json({ success: true }).end();
  } else {
    await errorHandler(res, { status: 401 });
  }
});

module.exports = {
  signup,
  signin,
  signout,
  googleSignIn,
};
