import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    BarChart3,
    CalendarDays,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    IndianRupee,
    FileText,
    Users,
    Truck,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";


const Report = () => {

    // ============================================================
    // STATES
    // ============================================================

    const [period, setPeriod] = useState("1day");

    const [report, setReport] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ============================================================
    // PERIOD LABEL
    // ============================================================

    const periodLabels = {
        "1day": "Today",
        "7days": "Last 7 Days",
        "1month": "Last 30 Days",
        "1year": "Last 365 Days"
    };


    // ============================================================
    // FETCH REPORT
    // ============================================================

    const fetchReport = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await axios.get(
                `http://localhost:5000/api/reports?period=${period}`
            );


            console.log(
                "REPORT RESPONSE:",
                response.data
            );


            if (response.data.success) {

                setReport(response.data);

            } else {

                setError(
                    response.data.message ||
                    "Failed to fetch report"
                );

            }

        } catch (error) {

            console.error(
                "REPORT ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to fetch report"
            );

        } finally {

            setLoading(false);

        }
    };


    // ============================================================
    // FETCH WHEN PERIOD CHANGES
    // ============================================================

    useEffect(() => {

        fetchReport();

    }, [period]);


    // ============================================================
    // FORMAT MONEY
    // ============================================================

    const formatMoney = (amount) => {

        return `₹${Number(
            amount || 0
        ).toLocaleString("en-IN")}`;

    };


    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (

            <div className="
                flex
                min-h-[60vh]
                items-center
                justify-center
            ">

                <div className="text-center">

                    <RefreshCw
                        size={34}
                        className="
                            mx-auto
                            animate-spin
                            text-blue-600
                        "
                    />

                    <p className="
                        mt-3
                        text-sm
                        font-semibold
                        text-gray-600
                    ">
                        Loading report...
                    </p>

                </div>

            </div>

        );
    }


    // ============================================================
    // ERROR
    // ============================================================

    if (error) {

        return (

            <div className="
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-6
            ">

                <h2 className="
                    font-bold
                    text-red-700
                ">
                    Report Error
                </h2>

                <p className="
                    mt-1
                    text-sm
                    text-red-600
                ">
                    {error}
                </p>

                <button
                    onClick={fetchReport}
                    className="
                        mt-4
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-red-600
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        hover:bg-red-700
                    "
                >

                    <RefreshCw size={16} />

                    Try Again

                </button>

            </div>

        );
    }


    // ============================================================
    // DATA
    // ============================================================

    const summary = report?.summary || {};

    const salesDetails =
        report?.sales_details || [];

    const purchaseDetails =
        report?.purchase_details || [];

    const dailySales =
        report?.daily_sales || [];

    const dailyPurchases =
        report?.daily_purchases || [];


    // ============================================================
    // HIGHEST / LOWEST
    // ============================================================

    const highestSales =
        summary.highest_sales_day;

    const lowestSales =
        summary.lowest_sales_day;

    const highestPurchase =
        summary.highest_purchase_day;

    const lowestPurchase =
        summary.lowest_purchase_day;


    // ============================================================
    // UI
    // ============================================================

    return (

        <div className="
            space-y-6
            pb-8
        ">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">

                <div className="
                    flex
                    items-center
                    gap-4
                ">

                    <div className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-blue-100
                        text-blue-600
                    ">

                        <BarChart3 size={28} />

                    </div>


                    <div>

                        <h1 className="
                            text-2xl
                            font-extrabold
                            tracking-tight
                            text-gray-800
                            sm:text-3xl
                        ">
                            Reports
                        </h1>

                        <p className="
                            mt-1
                            text-sm
                            text-gray-500
                        ">
                            Sales and purchase performance
                        </p>

                    </div>

                </div>


                <button
                    onClick={fetchReport}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-gray-700
                        shadow-sm
                        transition
                        hover:bg-gray-50
                    "
                >

                    <RefreshCw size={17} />

                    Refresh

                </button>

            </div>


            {/* ==================================================
                PERIOD SELECTOR
            ================================================== */}

            <div className="
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-5
                shadow-sm
            ">

                <div className="
                    flex
                    flex-col
                    gap-4
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                ">


                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-50
                            text-blue-600
                        ">

                            <CalendarDays size={21} />

                        </div>


                        <div>

                            <h2 className="
                                font-bold
                                text-gray-800
                            ">
                                Report Period
                            </h2>

                            <p className="
                                text-sm
                                text-gray-400
                            ">
                                {periodLabels[period]}
                            </p>

                        </div>

                    </div>


                    <div className="
                        grid
                        grid-cols-2
                        gap-2
                        sm:grid-cols-4
                    ">

                        <button
                            onClick={() =>
                                setPeriod("1day")
                            }
                            className={`
                                rounded-xl
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                transition
                                ${period === "1day"
                                    ? `
                                            bg-blue-600
                                            text-white
                                            shadow-lg
                                            shadow-blue-500/20
                                        `
                                    : `
                                            bg-gray-100
                                            text-gray-700
                                            hover:bg-gray-200
                                        `
                                }
                            `}
                        >
                            1 Day
                        </button>


                        <button
                            onClick={() =>
                                setPeriod("7days")
                            }
                            className={`
                                rounded-xl
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                transition
                                ${period === "7days"
                                    ? `
                                            bg-blue-600
                                            text-white
                                            shadow-lg
                                            shadow-blue-500/20
                                        `
                                    : `
                                            bg-gray-100
                                            text-gray-700
                                            hover:bg-gray-200
                                        `
                                }
                            `}
                        >
                            7 Days
                        </button>


                        <button
                            onClick={() =>
                                setPeriod("1month")
                            }
                            className={`
                                rounded-xl
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                transition
                                ${period === "1month"
                                    ? `
                                            bg-blue-600
                                            text-white
                                            shadow-lg
                                            shadow-blue-500/20
                                        `
                                    : `
                                            bg-gray-100
                                            text-gray-700
                                            hover:bg-gray-200
                                        `
                                }
                            `}
                        >
                            1 Month
                        </button>


                        <button
                            onClick={() =>
                                setPeriod("1year")
                            }
                            className={`
                                rounded-xl
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                transition
                                ${period === "1year"
                                    ? `
                                            bg-blue-600
                                            text-white
                                            shadow-lg
                                            shadow-blue-500/20
                                        `
                                    : `
                                            bg-gray-100
                                            text-gray-700
                                            hover:bg-gray-200
                                        `
                                }
                            `}
                        >
                            1 Year
                        </button>

                    </div>

                </div>

            </div>


            {/* ==================================================
                DATE RANGE
            ================================================== */}

            <div className="
                rounded-xl
                bg-blue-50
                px-4
                py-3
                text-sm
                text-blue-700
            ">

                Showing data from

                <span className="mx-1 font-bold">
                    {formatDate(report?.start_date)}
                </span>

                to

                <span className="mx-1 font-bold">
                    {formatDate(report?.end_date)}
                </span>

            </div>


            {/* ==================================================
                MAIN SUMMARY
            ================================================== */}

            <div className="
                grid
                grid-cols-1
                gap-5
                lg:grid-cols-2
            ">


                {/* SALES */}

                <div className="
                    rounded-2xl
                    bg-gradient-to-br
                    from-emerald-500
                    to-green-600
                    p-6
                    text-white
                    shadow-sm
                ">

                    <div className="
                        flex
                        items-start
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-green-100
                            ">
                                Total Sales
                            </p>

                            <p className="
                                mt-2
                                text-3xl
                                font-extrabold
                                sm:text-4xl
                            ">
                                {formatMoney(
                                    summary.total_sales
                                )}
                            </p>

                            <p className="
                                mt-3
                                text-sm
                                text-green-100
                            ">
                                {summary.sales_orders || 0} customer orders
                            </p>

                        </div>


                        <div className="
                            rounded-xl
                            bg-white/20
                            p-3
                        ">

                            <TrendingUp size={25} />

                        </div>

                    </div>

                </div>


                {/* PURCHASES */}

                <div className="
                    rounded-2xl
                    bg-gradient-to-br
                    from-orange-500
                    to-orange-600
                    p-6
                    text-white
                    shadow-sm
                ">

                    <div className="
                        flex
                        items-start
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-orange-100
                            ">
                                Total Purchases
                            </p>

                            <p className="
                                mt-2
                                text-3xl
                                font-extrabold
                                sm:text-4xl
                            ">
                                {formatMoney(
                                    summary.total_purchases
                                )}
                            </p>

                            <p className="
                                mt-3
                                text-sm
                                text-orange-100
                            ">
                                {summary.purchase_orders || 0} purchase orders
                            </p>

                        </div>


                        <div className="
                            rounded-xl
                            bg-white/20
                            p-3
                        ">

                            <ShoppingCart size={25} />

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                ORDER COUNTS
            ================================================== */}

            <div className="
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
            ">


                <div className="
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                    p-5
                    shadow-sm
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-gray-500
                            ">
                                Customer Sales Orders
                            </p>

                            <p className="
                                mt-2
                                text-3xl
                                font-extrabold
                                text-gray-800
                            ">
                                {summary.sales_orders || 0}
                            </p>

                            <p className="
                                mt-1
                                text-xs
                                text-gray-400
                            ">
                                Orders received from customers
                            </p>

                        </div>


                        <div className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-green-100
                            text-green-600
                        ">

                            <Users size={23} />

                        </div>

                    </div>

                </div>


                <div className="
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                    p-5
                    shadow-sm
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-gray-500
                            ">
                                Supplier Purchase Orders
                            </p>

                            <p className="
                                mt-2
                                text-3xl
                                font-extrabold
                                text-gray-800
                            ">
                                {summary.purchase_orders || 0}
                            </p>

                            <p className="
                                mt-1
                                text-xs
                                text-gray-400
                            ">
                                Orders placed with suppliers
                            </p>

                        </div>


                        <div className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-orange-100
                            text-orange-600
                        ">

                            <Truck size={23} />

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                HIGHEST / LOWEST SALES
            ================================================== */}

            <div className="
                grid
                grid-cols-1
                gap-5
                lg:grid-cols-2
            ">


                {/* HIGHEST SALES */}

                <div className="
                    rounded-2xl
                    border
                    border-green-100
                    bg-green-50
                    p-5
                ">

                    <div className="
                        flex
                        items-center
                        gap-4
                    ">

                        <div className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-green-100
                            text-green-600
                        ">

                            <ArrowUpRight size={25} />

                        </div>


                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-gray-500
                            ">
                                Highest Sales Day
                            </p>

                            <p className="
                                mt-1
                                text-2xl
                                font-extrabold
                                text-gray-800
                            ">
                                {highestSales
                                    ? formatMoney(
                                        highestSales.total_amount
                                    )
                                    : "₹0"
                                }
                            </p>

                            <p className="
                                mt-1
                                text-xs
                                text-gray-500
                            ">
                                {highestSales
                                    ? formatDate(
                                        highestSales.report_date
                                    )
                                    : "No sales in selected period"
                                }
                            </p>

                        </div>

                    </div>

                </div>


                {/* LOWEST SALES */}

                <div className="
                    rounded-2xl
                    border
                    border-red-100
                    bg-red-50
                    p-5
                ">

                    <div className="
                        flex
                        items-center
                        gap-4
                    ">

                        <div className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-red-100
                            text-red-600
                        ">

                            <ArrowDownRight size={25} />

                        </div>


                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-gray-500
                            ">
                                Lowest Sales Day
                            </p>

                            <p className="
                                mt-1
                                text-2xl
                                font-extrabold
                                text-gray-800
                            ">
                                {lowestSales
                                    ? formatMoney(
                                        lowestSales.total_amount
                                    )
                                    : "₹0"
                                }
                            </p>

                            <p className="
                                mt-1
                                text-xs
                                text-gray-500
                            ">
                                {lowestSales
                                    ? formatDate(
                                        lowestSales.report_date
                                    )
                                    : "No sales in selected period"
                                }
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                HIGHEST / LOWEST PURCHASE
            ================================================== */}

            <div className="
                grid
                grid-cols-1
                gap-5
                lg:grid-cols-2
            ">


                {/* HIGHEST PURCHASE */}

                <div className="
                    rounded-2xl
                    border
                    border-orange-100
                    bg-orange-50
                    p-5
                ">

                    <div className="
                        flex
                        items-center
                        gap-4
                    ">

                        <div className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-orange-100
                            text-orange-600
                        ">

                            <ArrowUpRight size={25} />

                        </div>


                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-gray-500
                            ">
                                Highest Purchase Day
                            </p>

                            <p className="
                                mt-1
                                text-2xl
                                font-extrabold
                                text-gray-800
                            ">
                                {highestPurchase
                                    ? formatMoney(
                                        highestPurchase.total_amount
                                    )
                                    : "₹0"
                                }
                            </p>

                            <p className="
                                mt-1
                                text-xs
                                text-gray-500
                            ">
                                {highestPurchase
                                    ? formatDate(
                                        highestPurchase.report_date
                                    )
                                    : "No purchases in selected period"
                                }
                            </p>

                        </div>

                    </div>

                </div>


                {/* LOWEST PURCHASE */}

                <div className="
                    rounded-2xl
                    border
                    border-yellow-100
                    bg-yellow-50
                    p-5
                ">

                    <div className="
                        flex
                        items-center
                        gap-4
                    ">

                        <div className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-yellow-100
                            text-yellow-600
                        ">

                            <ArrowDownRight size={25} />

                        </div>


                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-gray-500
                            ">
                                Lowest Purchase Day
                            </p>

                            <p className="
                                mt-1
                                text-2xl
                                font-extrabold
                                text-gray-800
                            ">
                                {lowestPurchase
                                    ? formatMoney(
                                        lowestPurchase.total_amount
                                    )
                                    : "₹0"
                                }
                            </p>

                            <p className="
                                mt-1
                                text-xs
                                text-gray-500
                            ">
                                {lowestPurchase
                                    ? formatDate(
                                        lowestPurchase.report_date
                                    )
                                    : "No purchases in selected period"
                                }
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                SALES DETAILS
            ================================================== */}

            <div className="
                overflow-hidden
                rounded-2xl
                border
                border-gray-100
                bg-white
                shadow-sm
            ">

                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-gray-100
                    p-5
                ">

                    <div>

                        <h2 className="
                            text-lg
                            font-bold
                            text-gray-800
                        ">
                            Sales Details
                        </h2>

                        <p className="
                            mt-1
                            text-xs
                            text-gray-400
                        ">
                            Customer orders during selected period
                        </p>

                    </div>


                    <div className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-green-100
                        text-green-600
                    ">

                        <TrendingUp size={19} />

                    </div>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="
                                border-b
                                border-gray-100
                                bg-gray-50
                            ">

                                <th className="
                                    px-5
                                    py-3
                                    text-left
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-gray-500
                                ">
                                    Order
                                </th>

                                <th className="
                                    px-5
                                    py-3
                                    text-left
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-gray-500
                                ">
                                    Customer
                                </th>

                                <th className="
                                    px-5
                                    py-3
                                    text-left
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-gray-500
                                ">
                                    Date
                                </th>

                                <th className="
                                    px-5
                                    py-3
                                    text-right
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-gray-500
                                ">
                                    Amount
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {salesDetails.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="
                                            px-5
                                            py-10
                                            text-center
                                            text-sm
                                            text-gray-400
                                        "
                                    >
                                        No sales found for this period.
                                    </td>

                                </tr>

                            ) : (

                                salesDetails.map((order) => (

                                    <tr
                                        key={order.order_id}
                                        className="
                                            border-b
                                            border-gray-100
                                            last:border-0
                                            hover:bg-gray-50
                                        "
                                    >

                                        <td className="
                                            px-5
                                            py-4
                                            text-sm
                                            font-bold
                                            text-gray-700
                                        ">
                                            #{order.order_id}
                                        </td>


                                        <td className="
                                            px-5
                                            py-4
                                            text-sm
                                            font-semibold
                                            text-gray-800
                                        ">
                                            {order.customer_name ||
                                                "Unknown Customer"}
                                        </td>


                                        <td className="
                                            px-5
                                            py-4
                                            text-sm
                                            text-gray-500
                                        ">
                                            {formatDate(
                                                order.order_date
                                            )}
                                        </td>


                                        <td className="
                                            px-5
                                            py-4
                                            text-right
                                            text-sm
                                            font-bold
                                            text-green-600
                                        ">
                                            {formatMoney(
                                                order.total_amount
                                            )}
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ==================================================
                PURCHASE DETAILS
            ================================================== */}

            <div className="
                overflow-hidden
                rounded-2xl
                border
                border-gray-100
                bg-white
                shadow-sm
            ">

                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-gray-100
                    p-5
                ">

                    <div>

                        <h2 className="
                            text-lg
                            font-bold
                            text-gray-800
                        ">
                            Purchase Details
                        </h2>

                        <p className="
                            mt-1
                            text-xs
                            text-gray-400
                        ">
                            Supplier orders during selected period
                        </p>

                    </div>


                    <div className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-orange-100
                        text-orange-600
                    ">

                        <ShoppingCart size={19} />

                    </div>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="
                                border-b
                                border-gray-100
                                bg-gray-50
                            ">

                                <th className="
                                    px-5
                                    py-3
                                    text-left
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-gray-500
                                ">
                                    Purchase
                                </th>

                                <th className="
                                    px-5
                                    py-3
                                    text-left
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-gray-500
                                ">
                                    Supplier
                                </th>

                                <th className="
                                    px-5
                                    py-3
                                    text-left
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-gray-500
                                ">
                                    Date
                                </th>

                                <th className="
                                    px-5
                                    py-3
                                    text-right
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-gray-500
                                ">
                                    Amount
                                </th>

                                <th className="
                                    px-5
                                    py-3
                                    text-center
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-gray-500
                                ">
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {purchaseDetails.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="
                                            px-5
                                            py-10
                                            text-center
                                            text-sm
                                            text-gray-400
                                        "
                                    >
                                        No purchases found for this period.
                                    </td>

                                </tr>

                            ) : (

                                purchaseDetails.map((purchase) => (

                                    <tr
                                        key={purchase.purchase_id}
                                        className="
                                            border-b
                                            border-gray-100
                                            last:border-0
                                            hover:bg-gray-50
                                        "
                                    >

                                        <td className="
                                            px-5
                                            py-4
                                            text-sm
                                            font-bold
                                            text-gray-700
                                        ">
                                            #{purchase.purchase_id}
                                        </td>


                                        <td className="
                                            px-5
                                            py-4
                                            text-sm
                                            font-semibold
                                            text-gray-800
                                        ">
                                            {purchase.supplier_name ||
                                                "Unknown Supplier"}
                                        </td>


                                        <td className="
                                            px-5
                                            py-4
                                            text-sm
                                            text-gray-500
                                        ">
                                            {formatDate(
                                                purchase.order_date
                                            )}
                                        </td>


                                        <td className="
                                            px-5
                                            py-4
                                            text-right
                                            text-sm
                                            font-bold
                                            text-orange-600
                                        ">
                                            {formatMoney(
                                                purchase.total_amount
                                            )}
                                        </td>


                                        <td className="
                                            px-5
                                            py-4
                                            text-center
                                        ">

                                            <span className="
                                                rounded-full
                                                bg-orange-100
                                                px-3
                                                py-1
                                                text-xs
                                                font-bold
                                                text-orange-700
                                            ">
                                                {purchase.purchase_status ||
                                                    "Pending"}
                                            </span>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ==================================================
                DAILY SALES SUMMARY
            ================================================== */}

            {dailySales.length > 0 && (

                <div className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                    shadow-sm
                ">

                    <div className="
                        border-b
                        border-gray-100
                        p-5
                    ">

                        <h2 className="
                            text-lg
                            font-bold
                            text-gray-800
                        ">
                            Daily Sales Summary
                        </h2>

                        <p className="
                            mt-1
                            text-xs
                            text-gray-400
                        ">
                            Sales grouped by date
                        </p>

                    </div>


                    <div className="
                        grid
                        grid-cols-1
                        gap-3
                        p-5
                        sm:grid-cols-2
                        lg:grid-cols-3
                    ">

                        {dailySales.map((day) => (

                            <div
                                key={day.report_date}
                                className="
                                    rounded-xl
                                    bg-green-50
                                    p-4
                                "
                            >

                                <p className="
                                    text-xs
                                    font-semibold
                                    text-gray-500
                                ">
                                    {formatDate(
                                        day.report_date
                                    )}
                                </p>


                                <p className="
                                    mt-2
                                    text-xl
                                    font-extrabold
                                    text-green-700
                                ">
                                    {formatMoney(
                                        day.total_amount
                                    )}
                                </p>


                                <p className="
                                    mt-1
                                    text-xs
                                    text-gray-400
                                ">
                                    {day.order_count} order(s)
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            )}


            {/* ==================================================
                DAILY PURCHASE SUMMARY
            ================================================== */}

            {dailyPurchases.length > 0 && (

                <div className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                    shadow-sm
                ">

                    <div className="
                        border-b
                        border-gray-100
                        p-5
                    ">

                        <h2 className="
                            text-lg
                            font-bold
                            text-gray-800
                        ">
                            Daily Purchase Summary
                        </h2>

                        <p className="
                            mt-1
                            text-xs
                            text-gray-400
                        ">
                            Purchases grouped by date
                        </p>

                    </div>


                    <div className="
                        grid
                        grid-cols-1
                        gap-3
                        p-5
                        sm:grid-cols-2
                        lg:grid-cols-3
                    ">

                        {dailyPurchases.map((day) => (

                            <div
                                key={day.report_date}
                                className="
                                    rounded-xl
                                    bg-orange-50
                                    p-4
                                "
                            >

                                <p className="
                                    text-xs
                                    font-semibold
                                    text-gray-500
                                ">
                                    {formatDate(
                                        day.report_date
                                    )}
                                </p>


                                <p className="
                                    mt-2
                                    text-xl
                                    font-extrabold
                                    text-orange-700
                                ">
                                    {formatMoney(
                                        day.total_amount
                                    )}
                                </p>


                                <p className="
                                    mt-1
                                    text-xs
                                    text-gray-400
                                ">
                                    {day.order_count} order(s)
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </div>
    );
};


export default Report;