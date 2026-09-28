const express = require("express");

const router = express.Router();

const {
    signup,
    login,
    getMe
} = require("../controllers/authController");


// ============================================================
// SIGNUP
// ============================================================

router.post("/signup", signup);


// ============================================================
// LOGIN
// ============================================================

router.post("/login", login);


// ============================================================
// CURRENT USER
// ============================================================

router.get("/me", getMe);


module.exports = router;