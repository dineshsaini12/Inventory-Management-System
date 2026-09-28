const db = require("../config/db");


// ==========================================
// GET ALL SUPPLIERS
// ==========================================

const getAllSuppliers = (req, res) => {

    const sql = `
        SELECT
            supplier_id,
            supplier_name,
            phone_no,
            email,
            address
        FROM supplier
        ORDER BY supplier_id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error("Get suppliers error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch suppliers",
                error: err.message
            });

        }

        res.status(200).json({
            success: true,
            suppliers: results
        });

    });
};


// ==========================================
// ADD SUPPLIER
// ==========================================

const addSupplier = (req, res) => {

    const {
        supplier_name,
        phone_no,
        email,
        address
    } = req.body;


    // Validation

    if (!supplier_name || !supplier_name.trim()) {

        return res.status(400).json({
            success: false,
            message: "Supplier name is required"
        });

    }


    const sql = `
        INSERT INTO supplier
        (supplier_name, phone_no, email, address)
        VALUES (?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            supplier_name.trim(),
            phone_no || null,
            email || null,
            address || null
        ],
        (err, result) => {

            if (err) {

                console.error("Add supplier error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to add supplier",
                    error: err.message
                });

            }


            res.status(201).json({

                success: true,

                message: "Supplier added successfully",

                supplier: {
                    supplier_id: result.insertId,
                    supplier_name: supplier_name.trim(),
                    phone_no: phone_no || null,
                    email: email || null,
                    address: address || null
                }

            });

        }
    );

};


// ==========================================
// DELETE SUPPLIER
// ==========================================

const deleteSupplier = (req, res) => {

    const { supplierId } = req.params;


    const sql = `
        DELETE FROM supplier
        WHERE supplier_id = ?
    `;


    db.query(
        sql,
        [supplierId],
        (err, result) => {

            if (err) {

                console.error("Delete supplier error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to delete supplier",
                    error: err.message
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Supplier not found"
                });

            }


            res.status(200).json({

                success: true,

                message: "Supplier deleted successfully"

            });

        }
    );

};


module.exports = {
    getAllSuppliers,
    addSupplier,
    deleteSupplier
};