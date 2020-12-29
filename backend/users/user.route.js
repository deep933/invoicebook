var router = require('express').Router()
const userController = require('./user.controller')
const {Auth} = require('../middleware')

//user routes

router.get('/',Auth.auth,userController.getUser)


module.exports = router