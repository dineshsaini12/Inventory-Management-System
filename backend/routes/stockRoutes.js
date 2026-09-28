const express = require("express");

const router = express.Router();

const {
    getAllStock
} = require("../controllers/stockController");


// GET ALL STOCK
router.get("/", getAllStock);


module.exports = router;