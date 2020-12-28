var router = require('express').Router()
const userController = require('./user.controller')



//user routes

router.post('/new', userController.createUser)


router.get('/:id', (req, res) => {
    res.send("sdknsndsknds");
})


module.exports = router