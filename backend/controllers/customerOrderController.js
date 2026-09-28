const db = require("../config/db");

// ======================================================
// CREATE CUSTOMER ORDER
// ======================================================

const createCustomerOrder = (req, res) => {

    const {
        customer_name,
        phone_no,
        email,
        address,
        items,
        payment_method
    } = req.body;


    // ==================================================
    // VALIDATION
    // ==================================================

    if (!customer_name || customer_name.trim() === "") {

        return res.status(400).json({
            success: false,
            message: "Customer name is required"
        });

    }


    if (!items || !Array.isArray(items) || items.length === 0) {

        return res.status(400).json({
            success: false,
            message: "At least one product is required"
        });

    }


    if (!payment_method || payment_method.trim() === "") {

        return res.status(400).json({
            success: false,
            message: "Payment method is required"
        });

    }


    // ==================================================
    // CALCULATE TOTAL
    // ==================================================

    let totalAmount = 0;

    for (const item of items) {

        if (
            !item.product_id ||
            !item.quantity ||
            Number(item.quantity) <= 0 ||
            item.selling_price === undefined ||
            Number(item.selling_price) < 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid product, quantity or selling price"
            });

        }

        const quantity = Number(item.quantity);
        const sellingPrice = Number(item.selling_price);

        totalAmount += quantity * sellingPrice;
    }


    // ==================================================
    // START TRANSACTION
    // ==================================================

    db.beginTransaction((transactionError) => {

        if (transactionError) {

            return res.status(500).json({
                success: false,
                message: "Failed to start transaction",
                error: transactionError.message
            });

        }


        // ==================================================
        // 1. CREATE CUSTOMER
        // ==================================================

        const customerSql = `
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
            customerSql,
            [
                customer_name.trim(),
                phone_no || null,
                email || null,
                address || null
            ],
            (customerError, customerResult) => {

                if (customerError) {

                    return db.rollback(() => {

                        res.status(500).json({
                            success: false,
                            message: "Failed to create customer",
                            error: customerError.message
                        });

                    });

                }


                const customerId = customerResult.insertId;


                // ==================================================
                // 2. CREATE CUSTOMER ORDER
                // ==================================================

                const orderSql = `
                    INSERT INTO customer_order
                    (
                        customer_id,
                        order_date,
                        total_amount,
                        payment_status
                    )
                    VALUES (?, CURDATE(), ?, ?)
                `;


                db.query(
                    orderSql,
                    [
                        customerId,
                        totalAmount,
                        "Paid"
                    ],
                    (orderError, orderResult) => {

                        if (orderError) {

                            return db.rollback(() => {

                                res.status(500).json({
                                    success: false,
                                    message: "Failed to create customer order",
                                    error: orderError.message
                                });

                            });

                        }


                        const orderId = orderResult.insertId;


                        // ==================================================
                        // 3. INSERT ORDER ITEMS
                        // ==================================================

                        const itemSql = `
                            INSERT INTO customer_order_item
                            (
                                order_id,
                                product_id,
                                quantity,
                                selling_price
                            )
                            VALUES ?
                        `;


                        const itemValues = items.map((item) => {

                            const quantity = Number(item.quantity);
                            const sellingPrice = Number(item.selling_price);

                            return [
                                orderId,
                                item.product_id,
                                quantity,
                                sellingPrice
                            ];

                        });


                        db.query(
                            itemSql,
                            [itemValues],
                            (itemError) => {

                                if (itemError) {

                                    return db.rollback(() => {

                                        res.status(500).json({
                                            success: false,
                                            message: "Failed to create order items",
                                            error: itemError.message
                                        });

                                    });

                                }


                                // ==================================================
                                // 4. CREATE PAYMENT
                                // ==================================================

                                const paymentSql = `
                                    INSERT INTO payment
                                    (
                                        order_id,
                                        payment_method,
                                        payment_date
                                    )
                                    VALUES (?, ?, CURDATE())
                                `;


                                db.query(
                                    paymentSql,
                                    [
                                        orderId,
                                        payment_method
                                    ],
                                    (paymentError) => {

                                        if (paymentError) {

                                            return db.rollback(() => {

                                                res.status(500).json({
                                                    success: false,
                                                    message: "Failed to create payment",
                                                    error: paymentError.message
                                                });

                                            });

                                        }


                                        // ==================================================
                                        // 5. CHECK STOCK + CREATE INVENTORY SALE
                                        // ==================================================

                                        let completed = 0;
                                        let failed = false;


                                        items.forEach((item) => {

                                            const quantity =
                                                Number(item.quantity);


                                            // ------------------------------------------
                                            // Check current stock
                                            // ------------------------------------------

                                            const stockCheckSql = `
                                                SELECT stock_quantity
                                                FROM stock
                                                WHERE product_id = ?
                                                FOR UPDATE
                                            `;


                                            db.query(
                                                stockCheckSql,
                                                [item.product_id],
                                                (stockError, stockResults) => {

                                                    if (failed) {
                                                        return;
                                                    }


                                                    if (stockError) {

                                                        failed = true;

                                                        return db.rollback(() => {

                                                            res.status(500).json({
                                                                success: false,
                                                                message:
                                                                    "Failed to check stock",
                                                                error:
                                                                    stockError.message
                                                            });

                                                        });

                                                    }


                                                    // ------------------------------------------
                                                    // No stock record
                                                    // ------------------------------------------

                                                    if (
                                                        stockResults.length === 0
                                                    ) {

                                                        failed = true;

                                                        return db.rollback(() => {

                                                            res.status(400).json({
                                                                success: false,
                                                                message:
                                                                    `No stock record found for product ${item.product_id}`
                                                            });

                                                        });

                                                    }


                                                    const currentStock =
                                                        Number(
                                                            stockResults[0]
                                                                .stock_quantity
                                                        );


                                                    // ------------------------------------------
                                                    // Insufficient stock
                                                    // ------------------------------------------

                                                    if (
                                                        currentStock < quantity
                                                    ) {

                                                        failed = true;

                                                        return db.rollback(() => {

                                                            res.status(400).json({
                                                                success: false,
                                                                message:
                                                                    `Insufficient stock for product ${item.product_id}. Available: ${currentStock}, Required: ${quantity}`
                                                            });

                                                        });

                                                    }


                                                    // ------------------------------------------
                                                    // IMPORTANT:
                                                    // DO NOT UPDATE STOCK HERE.
                                                    //
                                                    // Inventory trigger updates stock.
                                                    // ------------------------------------------

                                                    const inventorySql = `
                                                        INSERT INTO inventory
                                                        (
                                                            product_id,
                                                            quantity_changed,
                                                            change_type
                                                        )
                                                        VALUES (?, ?, ?)
                                                    `;


                                                    db.query(
                                                        inventorySql,
                                                        [
                                                            item.product_id,
                                                            -quantity,
                                                            "SALE"
                                                        ],
                                                        (inventoryError) => {

                                                            if (failed) {
                                                                return;
                                                            }


                                                            if (inventoryError) {

                                                                failed = true;

                                                                return db.rollback(() => {

                                                                    res.status(500).json({
                                                                        success: false,
                                                                        message:
                                                                            "Failed to create inventory sale record",
                                                                        error:
                                                                            inventoryError.message
                                                                    });

                                                                });

                                                            }


                                                            completed++;


                                                            // ------------------------------------------
                                                            // All products processed
                                                            // ------------------------------------------

                                                            if (
                                                                completed ===
                                                                items.length
                                                            ) {

                                                                db.commit(
                                                                    (commitError) => {

                                                                        if (
                                                                            commitError
                                                                        ) {

                                                                            return db.rollback(
                                                                                () => {

                                                                                    res.status(500).json({
                                                                                        success: false,
                                                                                        message:
                                                                                            "Failed to complete customer order",
                                                                                        error:
                                                                                            commitError.message
                                                                                    });

                                                                                }
                                                                            );

                                                                        }


                                                                        // ------------------------------------------
                                                                        // SUCCESS
                                                                        // ------------------------------------------

                                                                        res.status(201).json({

                                                                            success: true,

                                                                            message:
                                                                                "Customer order created successfully",

                                                                            order_id:
                                                                                orderId,

                                                                            customer_id:
                                                                                customerId,

                                                                            total_amount:
                                                                                totalAmount

                                                                        });

                                                                    }
                                                                );

                                                            }

                                                        }
                                                    );

                                                }
                                            );

                                        });

                                    }
                                );

                            }
                        );

                    }
                );

            }
        );

    });

};
// ======================================================
// GET ALL CUSTOMER ORDERS
// ======================================================

// ======================================================
// GET ALL CUSTOMER ORDERS
// ======================================================

const getAllCustomerOrders = (req, res) => {

    const sql = `
        SELECT
            co.order_id,
            co.customer_id,
            c.customer_name,
            c.phone_no,
            c.email,
            c.address,
            co.order_date,
            co.total_amount,
            co.payment_status
        FROM customer_order co
        INNER JOIN customer c
            ON co.customer_id = c.customer_id
        ORDER BY co.order_id DESC
    `;

    db.query(sql, (error, results) => {

        if (error) {

            console.error("Get customer orders error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch customer orders",
                error: error.message
            });

        }

        res.status(200).json({
            success: true,
            orders: results
        });

    });

};


// ======================================================
// GET CUSTOMER ORDER DETAILS
// ======================================================

// ======================================================
// GET CUSTOMER ORDER DETAILS
// ======================================================

const getCustomerOrderDetails = (req, res) => {

    const orderId = req.params.orderId;

    if (!orderId) {
        return res.status(400).json({
            success: false,
            message: "Order ID is required"
        });
    }

    const sql = `
        SELECT
            co.order_id,
            co.order_date,
            co.total_amount,
            co.payment_status,

            c.customer_id,
            c.customer_name,
            c.phone_no,
            c.email,
            c.address,

            pmt.payment_id,
            pmt.payment_method,
            pmt.payment_date,

            coi.order_item_id,
            coi.product_id,
            coi.quantity,
            coi.selling_price,

            p.product_name

        FROM customer_order co

        INNER JOIN customer c
            ON co.customer_id = c.customer_id

        LEFT JOIN payment pmt
            ON co.order_id = pmt.order_id

        INNER JOIN customer_order_item coi
            ON co.order_id = coi.order_id

        INNER JOIN product p
            ON coi.product_id = p.product_id

        WHERE co.order_id = ?

        ORDER BY coi.order_item_id ASC
    `;

    db.query(
        sql,
        [orderId],
        (error, results) => {

            if (error) {

                console.error(
                    "Get customer order details error:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch customer order details",
                    error: error.message
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Customer order not found"
                });

            }

            const firstRow = results[0];

            const order = {

                // ==========================================
                // ORDER
                // ==========================================

                order_id: firstRow.order_id,

                order_date: firstRow.order_date,

                total_amount: firstRow.total_amount,

                payment_status: firstRow.payment_status,


                // ==========================================
                // CUSTOMER
                // ==========================================

                customer_id: firstRow.customer_id,

                customer_name: firstRow.customer_name,

                phone_no: firstRow.phone_no,

                email: firstRow.email,

                address: firstRow.address,


                // ==========================================
                // PAYMENT
                // ==========================================

                payment_id: firstRow.payment_id,

                payment_method: firstRow.payment_method,

                payment_date: firstRow.payment_date,


                // ==========================================
                // ITEMS
                // ==========================================

                items: results.map((item) => ({

                    order_item_id: item.order_item_id,

                    product_id: item.product_id,

                    product_name: item.product_name,

                    quantity: item.quantity,

                    selling_price: item.selling_price

                }))

            };


            res.status(200).json({
                success: true,
                order: order
            });

        }
    );
};
// ======================================================
// EXPORT
// ======================================================
module.exports = {
    createCustomerOrder,
    getAllCustomerOrders,
    getCustomerOrderDetails
};