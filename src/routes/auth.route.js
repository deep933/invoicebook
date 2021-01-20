var router = require('express').Router()
const { authController, tokenController } = require('../controllers')
const { Token } = require('../middleware')

router.post('/signup', authController.signUp)
router.post('/signin', authController.signIn)
router.post('/google', authController.googleSignIn)
router.get('/refresh', Token.isTokenExist, Token.refreshToken)
router.use(
  '/signout',
  Token.verifyOrRefreshExpiredToken,
  authController.signOut
)

module.exports = router
