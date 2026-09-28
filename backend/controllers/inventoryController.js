const db = require("../config/db");

// ======================================================
// GET ALL INVENTORY RECORDS
// ======================================================

const getAllInventory = (req, res) => {

    const sql = `
        SELECT
            i.inventory_id,
            i.product_id,
            p.product_name,
            i.quantity_changed,
            i.change_type

        FROM inventory i

        INNER JOIN product p
            ON i.product_id = p.product_id

        ORDER BY i.inventory_id DESC
    `;

    db.query(sql, (error, results) => {

        if (error) {

            console.error("Get inventory error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch inventory records",
                error: error.message
            });
        }

        res.status(200).json({
            success: true,
            inventory: results
        });
    });
};


// ======================================================
// GET INVENTORY BY PRODUCT
// ======================================================

const getInventoryByProduct = (req, res) => {

    const { productId } = req.params;

    const sql = `
        SELECT
            i.inventory_id,
            i.product_id,
            p.product_name,
            i.quantity_changed,
            i.change_type

        FROM inventory i

        INNER JOIN product p
            ON i.product_id = p.product_id

        WHERE i.product_id = ?

        ORDER BY i.inventory_id DESC
    `;

    db.query(sql, [productId], (error, results) => {

        if (error) {

            console.error(
                "Get product inventory error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to fetch product inventory",
                error: error.message
            });
        }

        res.status(200).json({
            success: true,
            inventory: results
        });
    });
};


module.exports = {
    getAllInventory,
    getInventoryByProduct
};