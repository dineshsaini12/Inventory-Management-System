const express = require("express");

const router = express.Router();

const {
    getAllSuppliers,
    addSupplier,
    deleteSupplier
} = require("../controllers/supplierController");


// ==========================================
// GET ALL SUPPLIERS
// ==========================================

router.get("/", getAllSuppliers);


// ==========================================
// ADD SUPPLIER
// ==========================================

router.post("/", addSupplier);


// ==========================================
// DELETE SUPPLIER
// ==========================================

router.delete("/:supplierId", deleteSupplier);


module.exports = router;