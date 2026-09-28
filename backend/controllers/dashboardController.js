const db = require("../config/db");

// ======================================================
// GET DASHBOARD DATA
// ======================================================

const getDashboardData = (req, res) => {

    // --------------------------------------------------
    // 1. TOTAL PRODUCTS
    // --------------------------------------------------

    const productCountSql = `
        SELECT COUNT(*) AS total_products
        FROM product
    `;


    // --------------------------------------------------
    // 2. TOTAL CURRENT STOCK
    // --------------------------------------------------

    const stockSql = `
        SELECT COALESCE(SUM(stock_quantity), 0) AS total_stock
        FROM stock
    `;


    // --------------------------------------------------
    // 3. TOTAL SUPPLIERS
    // --------------------------------------------------

    const supplierCountSql = `
        SELECT COUNT(*) AS total_suppliers
        FROM supplier
    `;


    // --------------------------------------------------
    // 4. TOTAL CUSTOMERS
    // --------------------------------------------------

    const customerCountSql = `
        SELECT COUNT(*) AS total_customers
        FROM customer
    `;


    // --------------------------------------------------
    // 5. CUSTOMER ORDERS
    // --------------------------------------------------

    const customerOrderCountSql = `
        SELECT COUNT(*) AS total_customer_orders
        FROM customer_order
    `;


    // --------------------------------------------------
    // 6. PURCHASE ORDERS
    // --------------------------------------------------

    const purchaseCountSql = `
        SELECT COUNT(*) AS total_purchase_orders
        FROM purchase_order
    `;


    // --------------------------------------------------
    // 7. TOTAL SALES REVENUE
    // --------------------------------------------------

    const salesRevenueSql = `
        SELECT COALESCE(SUM(total_amount), 0) AS total_sales
        FROM customer_order
    `;


    // --------------------------------------------------
    // 8. LOW STOCK PRODUCTS
    // --------------------------------------------------

    const lowStockSql = `
        SELECT
            s.product_id,
            p.product_name,
            s.stock_quantity
        FROM stock s
        INNER JOIN product p
            ON s.product_id = p.product_id
        WHERE s.stock_quantity <= 10
        ORDER BY s.stock_quantity ASC
        LIMIT 10
    `;


    // --------------------------------------------------
    // 9. RECENT INVENTORY ACTIVITY
    // --------------------------------------------------

    const inventorySql = `
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
        LIMIT 10
    `;


    // --------------------------------------------------
    // 10. RECENT CUSTOMER ORDERS
    // --------------------------------------------------

    const recentOrdersSql = `
        SELECT
            co.order_id,
            co.order_date,
            co.total_amount,
            co.payment_status,
            c.customer_name
        FROM customer_order co
        INNER JOIN customer c
            ON co.customer_id = c.customer_id
        ORDER BY co.order_id DESC
        LIMIT 10
    `;


    // ==================================================
    // EXECUTE ALL QUERIES
    // ==================================================

    db.query(productCountSql, (productError, productResult) => {

        if (productError) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch product count",
                error: productError.message
            });
        }


        db.query(stockSql, (stockError, stockResult) => {

            if (stockError) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch stock",
                    error: stockError.message
                });
            }


            db.query(
                supplierCountSql,
                (supplierError, supplierResult) => {

                    if (supplierError) {
                        return res.status(500).json({
                            success: false,
                            message: "Failed to fetch supplier count",
                            error: supplierError.message
                        });
                    }


                    db.query(
                        customerCountSql,
                        (customerError, customerResult) => {

                            if (customerError) {
                                return res.status(500).json({
                                    success: false,
                                    message: "Failed to fetch customer count",
                                    error: customerError.message
                                });
                            }


                            db.query(
                                customerOrderCountSql,
                                (orderError, orderResult) => {

                                    if (orderError) {
                                        return res.status(500).json({
                                            success: false,
                                            message:
                                                "Failed to fetch customer order count",
                                            error: orderError.message
                                        });
                                    }


                                    db.query(
                                        purchaseCountSql,
                                        (purchaseError, purchaseResult) => {

                                            if (purchaseError) {
                                                return res.status(500).json({
                                                    success: false,
                                                    message:
                                                        "Failed to fetch purchase order count",
                                                    error: purchaseError.message
                                                });
                                            }


                                            db.query(
                                                salesRevenueSql,
                                                (salesError, salesResult) => {

                                                    if (salesError) {
                                                        return res.status(500).json({
                                                            success: false,
                                                            message:
                                                                "Failed to fetch sales revenue",
                                                            error: salesError.message
                                                        });
                                                    }


                                                    db.query(
                                                        lowStockSql,
                                                        (lowStockError, lowStockResult) => {

                                                            if (lowStockError) {
                                                                return res.status(500).json({
                                                                    success: false,
                                                                    message:
                                                                        "Failed to fetch low stock products",
                                                                    error: lowStockError.message
                                                                });
                                                            }


                                                            db.query(
                                                                inventorySql,
                                                                (inventoryError, inventoryResult) => {

                                                                    if (inventoryError) {
                                                                        return res.status(500).json({
                                                                            success: false,
                                                                            message:
                                                                                "Failed to fetch inventory activity",
                                                                            error: inventoryError.message
                                                                        });
                                                                    }


                                                                    db.query(
                                                                        recentOrdersSql,
                                                                        (
                                                                            recentOrderError,
                                                                            recentOrderResult
                                                                        ) => {

                                                                            if (
                                                                                recentOrderError
                                                                            ) {
                                                                                return res
                                                                                    .status(
                                                                                        500
                                                                                    )
                                                                                    .json({
                                                                                        success: false,
                                                                                        message:
                                                                                            "Failed to fetch recent orders",
                                                                                        error:
                                                                                            recentOrderError.message
                                                                                    });
                                                                            }


                                                                            // ==========================================
                                                                            // FINAL RESPONSE
                                                                            // ==========================================

                                                                            res.status(
                                                                                200
                                                                            ).json({

                                                                                success: true,

                                                                                summary: {

                                                                                    total_products:
                                                                                        productResult[0]
                                                                                            .total_products,

                                                                                    total_stock:
                                                                                        stockResult[0]
                                                                                            .total_stock,

                                                                                    total_suppliers:
                                                                                        supplierResult[0]
                                                                                            .total_suppliers,

                                                                                    total_customers:
                                                                                        customerResult[0]
                                                                                            .total_customers,

                                                                                    total_customer_orders:
                                                                                        orderResult[0]
                                                                                            .total_customer_orders,

                                                                                    total_purchase_orders:
                                                                                        purchaseResult[0]
                                                                                            .total_purchase_orders,

                                                                                    total_sales:
                                                                                        salesResult[0]
                                                                                            .total_sales
                                                                                },

                                                                                low_stock_products:
                                                                                    lowStockResult,

                                                                                recent_inventory:
                                                                                    inventoryResult,

                                                                                recent_orders:
                                                                                    recentOrderResult

                                                                            });

                                                                        }
                                                                    );

                                                                }
                                                            );

                                                        }
                                                    );

                                                }
                                            );

                                        }
                                    );

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


module.exports = {
    getDashboardData
};