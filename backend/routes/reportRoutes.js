const express = require("express");

const router = express.Router();

const {
    getReport
} = require("../controllers/reportController");


// GET REPORT
// Example:
// /api/reports?period=7d&type=both

router.get("/", getReport);


module.exports = router;