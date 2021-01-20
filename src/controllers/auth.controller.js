const { catchAsync, handleError, ErrorHandler, config } = require('../_helper')
const { authServices, tokenServices } = require('../services')

module.exports = {
  signUp: catchAsync(async (req, res) => {
    try {
      const token = await authServices.signupNewUser(req.body)
      res
        .cookie('auth', token, {
          maxAge: token.refresh.exp.getTime(),
          httpOnly: true
        })
        .status(200)
        .json(token)
        .end()
    } catch (error) {
      handleError(res, error)
    }
  }),

  signIn: catchAsync(async (req, res) => {
    try {
      const email = req.body.email
      const pass = req.body.pass
      if (email && pass) {
        const token = await authServices.signInWithEmailPassword(email, pass)
        res.cookie('auth', token, {
          maxAge: token.refresh.exp.getTime(),
          ...config.cookie.defaultOptions
        })
        res.status(200).json({ success: true })
        res.end()
      } else {
        handleError(res, new ErrorHandler(401, 'Email & Pass Required!!!'))
      }
    } catch (error) {
      handleError(res, error)
    }
  }),

  signOut: catchAsync(async (req, res) => {
    if (!req.userId) {
      handleError(res, new ErrorHandler(404, 'User Not Found!'))
    } else {
      try {
        await authServices.signout(req.userId)
        res.cookie('auth', {
          maxAge: 0,
          ...config.cookie.defaultOptions
        })
        res
          .status(201)
          .json({ success: true })
          .end()
      } catch (error) {
        handleError(res, error)
      }
    }
  }),

  googleSignIn: catchAsync(async (req, res) => {
    if (!req.body.token) {
      handleError(res, new ErrorHandler(401, 'Unauthorized Access!!'))
    } else {
      try {
        const payload = await tokenServices.verifyGoogleAuthToken(
          req.body.token
        )
        const token = await authServices.signInWithGoogle(payload)
        res.cookie('auth', token, {
          maxAge: token.refresh.exp.getTime(),
          ...config.cookie.defaultOptions
        })
        res
          .status(201)
          .json({ success: true })
          .end()
      } catch (error) {
        handleError(res, error)
      }
    }
  })
}
