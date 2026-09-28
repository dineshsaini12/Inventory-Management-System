const db = require("../config/db");

// ==========================================
// 1. GET ALL PRODUCTS
// ==========================================

const getAllProducts = (req, res) => {

    const sql = "SELECT * FROM Product";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch products",
                error: err.message
            });
        }

        res.json({
            success: true,
            products: result
        });
    });
};


// ==========================================
// 2. GET PRODUCT BY ID
// ==========================================

const getProductById = (req, res) => {

    const productId = req.params.id;

    const sql = "SELECT * FROM Product WHERE product_id = ?";

    db.query(sql, [productId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch product",
                error: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            product: result[0]
        });
    });
};


// ==========================================
// 3. CREATE PRODUCT
// ==========================================

const createProduct = (req, res) => {

    const {
        product_name,
        price
    } = req.body;


    const sql = `
        INSERT INTO Product
        (product_name, price)
        VALUES (?, ?)
    `;


    db.query(
        sql,
        [product_name, price],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to create product",
                    error: err.message
                });
            }


            res.status(201).json({
                success: true,
                message: "Product created successfully",
                product_id: result.insertId
            });

        }
    );
};

// ==========================================
// 4. UPDATE PRODUCT
// ==========================================

const updateProduct = (req, res) => {

    const productId = req.params.id;

    const {
        product_name,
        price
    } = req.body;


    const sql = `
        UPDATE Product
        SET product_name = ?, price = ?
        WHERE product_id = ?
    `;


    db.query(
        sql,
        [product_name, price, productId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to update product",
                    error: err.message
                });
            }


            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }


            res.json({
                success: true,
                message: "Product updated successfully"
            });

        }
    );
};

// ==========================================
// 5. DELETE PRODUCT
// ==========================================

const deleteProduct = (req, res) => {

    const productId = req.params.id;

    const sql = "DELETE FROM Product WHERE product_id = ?";

    db.query(sql, [productId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete product",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            message: "Product deleted successfully"
        });

    });
};


//delete multiple recordes

const deleteMultipleProducts = (req, res) => {

    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Please provide product IDs"
        });
    }

    const sql = `
        DELETE FROM Product
        WHERE product_id IN (?)
    `;

    db.query(sql, [ids], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete products",
                error: err.message
            });
        }

        res.json({
            success: true,
            message: `${result.affectedRows} products deleted successfully`
        });

    });
};
// ==========================================
// EXPORT
// ==========================================

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteMultipleProducts
};