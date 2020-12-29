var router = require("express").Router();
const userController = require("./user.controller");

//user routes

router.get("/", userController.getUser);

module.exports = router;
