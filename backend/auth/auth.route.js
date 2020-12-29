var router = require("express").Router();
const authController = require("./auth.controller");
const {tokenController} = require("../token");

//user routes

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.use("/refresh", tokenController.refreshToken);
router.use("/signout", authController.signout);


module.exports = router;
