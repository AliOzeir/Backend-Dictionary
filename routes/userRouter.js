const express = require("express");
const userController = require("./../controllers/userController");
const tokenAuth = require("./../middleware/tokenVerify");

const router = express.Router();

// --- Create new user
router.post("/signup", userController.signup);
// --- Login with an existing user
router.post("/login", userController.login);
// --- Return a single user
router.get("/getUser", tokenAuth.verifyAndDecode, userController.getUser);
// --- Logout a user
router.delete("/logout", tokenAuth.verifyAndDecode, userController.logout);

module.exports = router;
