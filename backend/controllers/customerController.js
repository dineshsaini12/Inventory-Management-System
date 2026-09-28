const db = require("../config/db");

// ==========================================
// GET ALL CUSTOMERS
// ==========================================

const getAllCustomers = (req, res) => {

    const sql = `
        SELECT
            customer_id,
            customer_name,
            phone_no,
            email,
            address
        FROM customer
        ORDER BY customer_id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error("Get customers error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch customers",
                error: err.message
            });

        }

        res.status(200).json({
            success: true,
            customers: results
        });

    });

};


// ==========================================
// GET CUSTOMER BY ID
// ==========================================

const getCustomerById = (req, res) => {

    const customerId = req.params.customerId;

    if (!customerId) {

        return res.status(400).json({
            success: false,
            message: "Customer ID is required"
        });

    }

    const sql = `
        SELECT
            customer_id,
            customer_name,
            phone_no,
            email,
            address
        FROM customer
        WHERE customer_id = ?
    `;

    db.query(
        sql,
        [customerId],
        (err, results) => {

            if (err) {

                console.error(
                    "Get customer error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch customer",
                    error: err.message
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Customer not found"
                });

            }

            res.status(200).json({
                success: true,
                customer: results[0]
            });

        }
    );

};


// ==========================================
// CREATE CUSTOMER
// ==========================================

const createCustomer = (req, res) => {

    const {
        customer_name,
        phone_no,
        email,
        address
    } = req.body;


    // CUSTOMER NAME REQUIRED

    if (!customer_name) {

        return res.status(400).json({
            success: false,
            message: "Customer name is required"
        });

    }


    const sql = `
        INSERT INTO customer
        (
            customer_name,
            phone_no,
            email,
            address
        )
        VALUES (?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            customer_name,
            phone_no || null,
            email || null,
            address || null
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Create customer error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to create customer",
                    error: err.message
                });

            }


            res.status(201).json({

                success: true,

                message:
                    "Customer created successfully",

                customer_id:
                    result.insertId

            });

        }
    );

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer
};