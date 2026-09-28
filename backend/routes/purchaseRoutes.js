const express = require("express");

const router = express.Router();

const {
    getAllPurchases,
    getPurchaseDetails,
    createPurchase,
    receivePurchase,
    cancelPurchase
} = require("../controllers/purchaseController");


// GET ALL PURCHASES
router.get("/", getAllPurchases);

router.get(
    "/:purchaseId/details",
    getPurchaseDetails
);
// CREATE PURCHASE
router.post("/", createPurchase);

router.put("/:purchaseId/receive", receivePurchase);

router.put("/:purchaseId/cancel", cancelPurchase);


module.exports = router;