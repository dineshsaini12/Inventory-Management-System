const db = require("../config/db");

// ==========================================
// GET ALL STOCK
// ==========================================

const getAllStock = (req, res) => {

    const sql = `
        SELECT
            stock.product_id,
            product.product_name,
            product.price,
            stock.stock_quantity
        FROM stock
        INNER JOIN product
            ON stock.product_id = product.product_id
        ORDER BY stock.product_id ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error("Get stock error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch stock",
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            stock: results
        });

    });
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    getAllStock
};