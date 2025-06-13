const authController = require("../controllers/auth.controller");

const router = require("express").Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/authenticate", authController.authenticate);
router.get("/refresh", authController.refresh);

module.exports = router;