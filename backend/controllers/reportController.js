const db = require("../config/db");

// ============================================================
// PROMISE WRAPPER
// ============================================================

const query = (sql, values = []) => {

    return new Promise((resolve, reject) => {

        db.query(sql, values, (error, results) => {

            if (error) {
                reject(error);
            } else {
                resolve(results);
            }

        });

    });

};


// ============================================================
// GET REPORT
// ============================================================

const getReports = async (req, res) => {

    try {

        // ========================================================
        // GET PERIOD
        // ========================================================

        const { period = "1day" } = req.query;

        let numberOfDays = 1;


        switch (period) {

            case "1day":
            case "1d":

                numberOfDays = 1;

                break;


            case "7days":
            case "7day":
            case "7d":

                numberOfDays = 7;

                break;


            case "1month":
            case "30days":
            case "30d":

                numberOfDays = 30;

                break;


            case "1year":
            case "365days":
            case "365d":

                numberOfDays = 365;

                break;


            default:

                numberOfDays = 1;

        }


        // ========================================================
        // DATE CALCULATION
        // ========================================================

        const today = new Date();

        const endDate = new Date(today);

        const startDate = new Date(today);


        startDate.setDate(
            startDate.getDate() - (numberOfDays - 1)
        );


        // ========================================================
        // FORMAT DATE
        // ========================================================

        const formatDate = (date) => {

            const year = date.getFullYear();

            const month = String(
                date.getMonth() + 1
            ).padStart(2, "0");

            const day = String(
                date.getDate()
            ).padStart(2, "0");

            return `${year}-${month}-${day}`;

        };


        const startDateString =
            formatDate(startDate);

        const endDateString =
            formatDate(endDate);


        console.log("--------------------------------");

        console.log(
            "REPORT PERIOD:",
            period
        );

        console.log(
            "NUMBER OF DAYS:",
            numberOfDays
        );

        console.log(
            "START DATE:",
            startDateString
        );

        console.log(
            "END DATE:",
            endDateString
        );

        console.log("--------------------------------");


        // ========================================================
        // SALES DETAILS
        // ========================================================

        const salesDetails = await query(
            `
            SELECT
                co.order_id,
                co.customer_id,
                co.order_date,
                co.total_amount,
                c.customer_name

            FROM customer_order co

            LEFT JOIN customer c
                ON co.customer_id = c.customer_id

            WHERE DATE(co.order_date)
                BETWEEN ? AND ?

            ORDER BY co.order_date DESC
            `,
            [
                startDateString,
                endDateString
            ]
        );


        // ========================================================
        // PURCHASE DETAILS
        // ========================================================

        const purchaseDetails = await query(
            `
            SELECT
                po.purchase_id,
                po.supplier_id,
                po.order_date,
                po.total_amount,
                po.purchase_status,
                s.supplier_name

            FROM purchase_order po

            LEFT JOIN supplier s
                ON po.supplier_id = s.supplier_id

            WHERE DATE(po.order_date)
                BETWEEN ? AND ?

            ORDER BY po.order_date DESC
            `,
            [
                startDateString,
                endDateString
            ]
        );


        // ========================================================
        // TOTAL SALES
        // ========================================================

        const totalSales =
            salesDetails.reduce(
                (total, order) => {

                    return total +
                        Number(
                            order.total_amount || 0
                        );

                },
                0
            );


        // ========================================================
        // TOTAL PURCHASES
        // ========================================================

        const totalPurchases =
            purchaseDetails.reduce(
                (total, purchase) => {

                    return total +
                        Number(
                            purchase.total_amount || 0
                        );

                },
                0
            );


        // ========================================================
        // DAILY SALES
        // ========================================================

        const dailySales = await query(
            `
            SELECT
                DATE(order_date) AS report_date,
                SUM(total_amount) AS total_amount,
                COUNT(*) AS order_count

            FROM customer_order

            WHERE DATE(order_date)
                BETWEEN ? AND ?

            GROUP BY DATE(order_date)

            ORDER BY report_date ASC
            `,
            [
                startDateString,
                endDateString
            ]
        );


        // ========================================================
        // DAILY PURCHASES
        // ========================================================

        const dailyPurchases = await query(
            `
            SELECT
                DATE(order_date) AS report_date,
                SUM(total_amount) AS total_amount,
                COUNT(*) AS order_count

            FROM purchase_order

            WHERE DATE(order_date)
                BETWEEN ? AND ?

            GROUP BY DATE(order_date)

            ORDER BY report_date ASC
            `,
            [
                startDateString,
                endDateString
            ]
        );


        // ========================================================
        // HIGHEST SALES DAY
        // ========================================================

        let highestSalesDay = null;


        if (dailySales.length > 0) {

            highestSalesDay =
                dailySales.reduce(
                    (highest, current) => {

                        return Number(
                            current.total_amount
                        ) >
                            Number(
                                highest.total_amount
                            )
                            ? current
                            : highest;

                    }
                );

        }


        // ========================================================
        // LOWEST SALES DAY
        // ========================================================

        let lowestSalesDay = null;


        if (dailySales.length > 0) {

            lowestSalesDay =
                dailySales.reduce(
                    (lowest, current) => {

                        return Number(
                            current.total_amount
                        ) <
                            Number(
                                lowest.total_amount
                            )
                            ? current
                            : lowest;

                    }
                );

        }


        // ========================================================
        // HIGHEST PURCHASE DAY
        // ========================================================

        let highestPurchaseDay = null;


        if (dailyPurchases.length > 0) {

            highestPurchaseDay =
                dailyPurchases.reduce(
                    (highest, current) => {

                        return Number(
                            current.total_amount
                        ) >
                            Number(
                                highest.total_amount
                            )
                            ? current
                            : highest;

                    }
                );

        }


        // ========================================================
        // LOWEST PURCHASE DAY
        // ========================================================

        let lowestPurchaseDay = null;


        if (dailyPurchases.length > 0) {

            lowestPurchaseDay =
                dailyPurchases.reduce(
                    (lowest, current) => {

                        return Number(
                            current.total_amount
                        ) <
                            Number(
                                lowest.total_amount
                            )
                            ? current
                            : lowest;

                    }
                );

        }


        // ========================================================
        // FINAL RESPONSE
        // ========================================================

        res.json({

            success: true,

            period: period,

            number_of_days: numberOfDays,

            start_date: startDateString,

            end_date: endDateString,


            summary: {

                total_sales:
                    totalSales,

                total_purchases:
                    totalPurchases,

                sales_orders:
                    salesDetails.length,

                purchase_orders:
                    purchaseDetails.length,

                highest_sales_day:
                    highestSalesDay,

                lowest_sales_day:
                    lowestSalesDay,

                highest_purchase_day:
                    highestPurchaseDay,

                lowest_purchase_day:
                    lowestPurchaseDay

            },


            sales_details:
                salesDetails,


            purchase_details:
                purchaseDetails,


            daily_sales:
                dailySales,


            daily_purchases:
                dailyPurchases

        });

    }

    catch (error) {

        console.error(
            "REPORT CONTROLLER ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch report",

            error:
                error.message

        });

    }

};


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getReports,

    getReport: getReports

};