var router = require("express").Router();
const authController = require("./auth.controller");
const { tokenController } = require("../token");
const { Auth } = require("../middleware")
//user routes

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/google", authController.googleSignIn)
router.use("/refresh", tokenController.refreshToken);
router.use("/signout", Auth.auth, authController.signout);


module.exports = router;
