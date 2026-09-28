const db = require("../config/db");


// ==========================================
// GET ALL PURCHASE ORDERS
// ==========================================

const getAllPurchases = (req, res) => {

    const sql = `
        SELECT
            po.purchase_id,
            po.supplier_id,
            s.supplier_name,
            po.order_date,
            po.total_amount,
            po.purchase_status,
            po.expected_date
        FROM purchase_order po
        LEFT JOIN supplier s
            ON po.supplier_id = s.supplier_id
        ORDER BY po.purchase_id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error("Get purchases error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch purchases",
                error: err.message
            });

        }

        res.status(200).json({
            success: true,
            purchases: results
        });

    });

};


// ==========================================
// GET PURCHASE DETAILS
// ==========================================
const getPurchaseDetails = (req, res) => {
    const purchaseId = req.params.purchaseId;

    if (!purchaseId) {
        return res.status(400).json({
            success: false,
            message: "Purchase ID is required"
        });
    }

    const sql = `
        SELECT
            po.purchase_id,
            po.supplier_id,
            s.supplier_name,
            po.order_date,
            po.expected_date,
            po.total_amount,
            po.purchase_status,

            poi.purchase_item_id,
            poi.product_id,
            p.product_name,
            poi.quantity,
            poi.unit_price,
            poi.total_price

        FROM purchase_order po

        LEFT JOIN supplier s
            ON po.supplier_id = s.supplier_id

        INNER JOIN purchase_order_item poi
            ON po.purchase_id = poi.purchase_id

        INNER JOIN product p
            ON poi.product_id = p.product_id

        WHERE po.purchase_id = ?

        ORDER BY poi.purchase_item_id ASC
    `;

    db.query(
        sql,
        [purchaseId],
        (err, results) => {

            if (err) {
                console.error(
                    "Get purchase details error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch purchase details",
                    error: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Purchase details not found"
                });
            }

            res.status(200).json({
                success: true,
                purchase: {
                    purchase_id: results[0].purchase_id,
                    supplier_id: results[0].supplier_id,
                    supplier_name: results[0].supplier_name,
                    order_date: results[0].order_date,
                    expected_date: results[0].expected_date,
                    total_amount: results[0].total_amount,
                    purchase_status: results[0].purchase_status,

                    items: results.map((item) => ({
                        purchase_item_id:
                            item.purchase_item_id,

                        product_id:
                            item.product_id,

                        product_name:
                            item.product_name,

                        quantity:
                            item.quantity,

                        unit_price:
                            item.unit_price,

                        total_price:
                            item.total_price
                    }))
                }
            });
        }
    );
};
const receivePurchase = (req, res) => {

    const purchaseId = req.params.purchaseId;

    if (!purchaseId) {
        return res.status(400).json({
            success: false,
            message: "Purchase ID is required"
        });
    }

    // Start transaction
    db.beginTransaction((transactionError) => {

        if (transactionError) {
            return res.status(500).json({
                success: false,
                message: "Failed to start transaction",
                error: transactionError.message
            });
        }

        // ------------------------------------------
        // 1. Get purchase and check status
        // ------------------------------------------

        const purchaseSql = `
            SELECT
                purchase_id,
                purchase_status
            FROM purchase_order
            WHERE purchase_id = ?
            FOR UPDATE
        `;

        db.query(
            purchaseSql,
            [purchaseId],
            (purchaseError, purchaseResults) => {

                if (purchaseError) {

                    return db.rollback(() => {
                        res.status(500).json({
                            success: false,
                            message: "Failed to find purchase",
                            error: purchaseError.message
                        });
                    });

                }

                if (purchaseResults.length === 0) {

                    return db.rollback(() => {
                        res.status(404).json({
                            success: false,
                            message: "Purchase not found"
                        });
                    });

                }

                const purchase = purchaseResults[0];


                // ------------------------------------------
                // 2. Prevent duplicate receiving
                // ------------------------------------------

                if (purchase.purchase_status === "Received") {

                    return db.rollback(() => {
                        res.status(400).json({
                            success: false,
                            message:
                                "This purchase has already been received"
                        });
                    });

                }


                // ------------------------------------------
                // 3. Prevent receiving cancelled purchase
                // ------------------------------------------

                if (purchase.purchase_status === "Cancelled") {

                    return db.rollback(() => {
                        res.status(400).json({
                            success: false,
                            message:
                                "Cancelled purchase cannot be received"
                        });
                    });

                }


                // ------------------------------------------
                // 4. Get purchase items
                // ------------------------------------------

                const itemsSql = `
                    SELECT
                        poi.product_id,
                        p.product_name,
                        poi.quantity
                    FROM purchase_order_item poi
                    INNER JOIN product p
                        ON poi.product_id = p.product_id
                    WHERE poi.purchase_id = ?
                `;

                db.query(
                    itemsSql,
                    [purchaseId],
                    (itemsError, items) => {

                        if (itemsError) {

                            return db.rollback(() => {
                                res.status(500).json({
                                    success: false,
                                    message:
                                        "Failed to fetch purchase items",
                                    error:
                                        itemsError.message
                                });
                            });

                        }


                        if (items.length === 0) {

                            return db.rollback(() => {
                                res.status(400).json({
                                    success: false,
                                    message:
                                        "Purchase has no products"
                                });
                            });

                        }

                        // ------------------------------------------
                        // 5. Update stock + add inventory
                        // ------------------------------------------

                        let completed = 0;
                        let failed = false;

                        items.forEach((item) => {

                            // ------------------------------------------
                            // 5A. Update stock ONCE
                            // ------------------------------------------

                            const stockSql = `
        INSERT INTO stock
        (
            product_id,
            stock_quantity
        )
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
            stock_quantity = stock_quantity + ?
    `;

                            db.query(
                                stockSql,
                                [
                                    item.product_id,
                                    item.quantity,
                                    item.quantity
                                ],
                                (stockError) => {

                                    if (failed) {
                                        return;
                                    }

                                    if (stockError) {

                                        failed = true;

                                        return db.rollback(() => {

                                            res.status(500).json({
                                                success: false,
                                                message: "Failed to update stock",
                                                error: stockError.message
                                            });

                                        });

                                    }


                                    // ------------------------------------------
                                    // 5B. Add inventory record
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
                                            item.quantity,
                                            "PURCHASE"
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
                                                            "Failed to create inventory log",
                                                        error:
                                                            inventoryError.message
                                                    });

                                                });

                                            }


                                            completed++;


                                            // ------------------------------------------
                                            // 6. All products processed
                                            // ------------------------------------------

                                            if (completed === items.length) {

                                                const statusSql = `
                            UPDATE purchase_order
                            SET purchase_status = ?
                            WHERE purchase_id = ?
                        `;

                                                db.query(
                                                    statusSql,
                                                    [
                                                        "Received",
                                                        purchaseId
                                                    ],
                                                    (statusError) => {

                                                        if (statusError) {

                                                            return db.rollback(() => {

                                                                res.status(500).json({
                                                                    success: false,
                                                                    message:
                                                                        "Failed to update purchase status",
                                                                    error:
                                                                        statusError.message
                                                                });

                                                            });

                                                        }


                                                        // ------------------------------------------
                                                        // 7. Commit
                                                        // ------------------------------------------

                                                        db.commit(
                                                            (commitError) => {

                                                                if (commitError) {

                                                                    return db.rollback(
                                                                        () => {

                                                                            res.status(500).json({
                                                                                success: false,
                                                                                message:
                                                                                    "Failed to complete purchase"
                                                                            });

                                                                        }
                                                                    );

                                                                }


                                                                res.status(200).json({

                                                                    success: true,

                                                                    message:
                                                                        "Purchase received successfully. Stock and inventory updated.",

                                                                    purchase_id:
                                                                        purchaseId

                                                                });

                                                            }
                                                        );

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

    });

};



const cancelPurchase = (req, res) => {

    const purchaseId = req.params.purchaseId;

    if (!purchaseId) {
        return res.status(400).json({
            success: false,
            message: "Purchase ID is required"
        });
    }

    const findPurchaseSql = `
        SELECT purchase_id, purchase_status
        FROM purchase_order
        WHERE purchase_id = ?
    `;

    db.query(
        findPurchaseSql,
        [purchaseId],
        (error, results) => {

            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to find purchase",
                    error: error.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Purchase not found"
                });
            }

            const purchase = results[0];

            // Already received
            if (purchase.purchase_status === "Received") {
                return res.status(400).json({
                    success: false,
                    message:
                        "Received purchase cannot be cancelled"
                });
            }

            // Already cancelled
            if (purchase.purchase_status === "Cancelled") {
                return res.status(400).json({
                    success: false,
                    message:
                        "Purchase is already cancelled"
                });
            }

            // Cancel pending purchase
            const updateSql = `
                UPDATE purchase_order
                SET purchase_status = ?
                WHERE purchase_id = ?
            `;

            db.query(
                updateSql,
                ["Cancelled", purchaseId],
                (updateError) => {

                    if (updateError) {
                        return res.status(500).json({
                            success: false,
                            message:
                                "Failed to cancel purchase",
                            error:
                                updateError.message
                        });
                    }

                    res.status(200).json({
                        success: true,
                        message:
                            "Purchase cancelled successfully",
                        purchase_id: purchaseId
                    });

                }
            );

        }
    );
};


// ==========================================
// CREATE PURCHASE ORDER
// ==========================================

const createPurchase = (req, res) => {

    const {
        supplier_id,
        order_date,
        expected_date,
        purchase_status,
        items
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!supplier_id) {

        return res.status(400).json({
            success: false,
            message: "Supplier is required"
        });

    }


    if (!items || !Array.isArray(items) || items.length === 0) {

        return res.status(400).json({
            success: false,
            message: "At least one product is required"
        });

    }


    // ==========================================
    // CALCULATE TOTAL
    // ==========================================

    let totalAmount = 0;


    for (const item of items) {

        if (
            !item.product_id ||
            !item.quantity ||
            Number(item.quantity) <= 0 ||
            item.unit_price === undefined ||
            Number(item.unit_price) < 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid product, quantity or price"
            });

        }


        const quantity = Number(item.quantity);
        const unitPrice = Number(item.unit_price);

        totalAmount += quantity * unitPrice;

    }


    // ==========================================
    // START TRANSACTION
    // ==========================================

    db.beginTransaction((transactionError) => {

        if (transactionError) {

            console.error(
                "Transaction start error:",
                transactionError
            );

            return res.status(500).json({
                success: false,
                message: "Failed to start purchase transaction"
            });

        }


        // ==========================================
        // INSERT PURCHASE ORDER
        // ==========================================

        const purchaseSql = `
            INSERT INTO purchase_order
            (
                supplier_id,
                order_date,
                total_amount,
                purchase_status,
                expected_date
            )
            VALUES (?, ?, ?, ?, ?)
        `;


        db.query(
            purchaseSql,
            [
                supplier_id,
                order_date || null,
                totalAmount,
                purchase_status || "Pending",
                expected_date || null
            ],
            (purchaseError, purchaseResult) => {

                if (purchaseError) {

                    return db.rollback(() => {

                        console.error(
                            "Create purchase error:",
                            purchaseError
                        );

                        res.status(500).json({
                            success: false,
                            message: "Failed to create purchase order",
                            error: purchaseError.message
                        });

                    });

                }


                const purchaseId =
                    purchaseResult.insertId;


                // ==========================================
                // INSERT PURCHASE ITEMS
                // ==========================================

                const itemSql = `
                    INSERT INTO purchase_order_item
                    (
                        purchase_id,
                        product_id,
                        quantity,
                        unit_price,
                        total_price
                    )
                    VALUES ?
                `;


                const itemValues = items.map((item) => {

                    const quantity =
                        Number(item.quantity);

                    const unitPrice =
                        Number(item.unit_price);

                    const totalPrice =
                        quantity * unitPrice;

                    return [
                        purchaseId,
                        item.product_id,
                        quantity,
                        unitPrice,
                        totalPrice
                    ];

                });


                db.query(
                    itemSql,
                    [itemValues],
                    (itemError) => {

                        if (itemError) {

                            return db.rollback(() => {

                                console.error(
                                    "Purchase item error:",
                                    itemError
                                );

                                res.status(500).json({
                                    success: false,
                                    message:
                                        "Failed to add purchase items",
                                    error:
                                        itemError.message
                                });

                            });

                        }


                        // ==========================================
                        // COMMIT
                        // ==========================================

                        db.commit((commitError) => {

                            if (commitError) {

                                return db.rollback(() => {

                                    console.error(
                                        "Commit error:",
                                        commitError
                                    );

                                    res.status(500).json({
                                        success: false,
                                        message:
                                            "Failed to save purchase"
                                    });

                                });

                            }


                            res.status(201).json({

                                success: true,

                                message:
                                    "Purchase order created successfully",

                                purchase_id:
                                    purchaseId,

                                total_amount:
                                    totalAmount

                            });

                        });

                    }
                );

            }
        );

    });

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    getAllPurchases,
    getPurchaseDetails,
    createPurchase,
    receivePurchase,
    cancelPurchase
};