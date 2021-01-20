var router = require('express').Router()
const { userController } = require('../controllers')
const { Token } = require('../middleware')

router.get('/', Token.verifyOrRefreshExpiredToken, userController.getUser)

module.exports = router
