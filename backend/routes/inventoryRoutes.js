const express = require("express");

const router = express.Router();

const {
    getAllInventory,
    getInventoryByProduct
} = require("../controllers/inventoryController");


// Get all inventory records
router.get("/", getAllInventory);


// Get inventory records for a particular product
router.get("/product/:productId", getInventoryByProduct);


module.exports = router;