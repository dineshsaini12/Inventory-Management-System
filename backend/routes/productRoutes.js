const express = require("express");

const router = express.Router();

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteMultipleProducts
} = require("../controllers/productController");


router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.post("/", createProduct);

router.put("/:id", updateProduct);

router.delete("/multiple", deleteMultipleProducts);

router.delete("/:id", deleteProduct);

module.exports = router;