var router = require("express").Router();
const authController = require("./auth.controller");
const tokenController = require("../token/token.controller");

//user routes

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.use("/refresh", tokenController.refreshToken);

// router.post('/login', userController.getUser)

module.exports = router;
