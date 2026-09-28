import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    Package,
    Boxes,
    Truck,
    Users,
    ShoppingCart,
    ClipboardList,
    IndianRupee,
    ArrowDownToLine,
    ArrowUpFromLine,
    AlertTriangle,
    RefreshCw,
    Plus,
    Eye
} from "lucide-react";

import { useNavigate } from "react-router-dom";


const Dashboard = () => {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ======================================================
    // FETCH DASHBOARD
    // ======================================================

    const fetchDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/dashboard"
            );

            console.log("Dashboard:", response.data);

            setDashboard(response.data);

        } catch (error) {

            console.error("Dashboard error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch dashboard data"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchDashboard();

    }, []);


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {

        return (
            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="text-center">

                    <RefreshCw
                        size={32}
                        className="mx-auto animate-spin text-blue-600"
                    />

                    <p className="mt-3 font-semibold text-gray-600">
                        Loading dashboard...
                    </p>

                </div>

            </div>
        );
    }


    // ======================================================
    // ERROR
    // ======================================================

    if (error) {

        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

                <p className="font-bold text-red-700">
                    Dashboard Error
                </p>

                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>

                <button
                    onClick={fetchDashboard}
                    className="
                        mt-4
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        bg-red-600
                        px-4
                        py-2
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


    const summary = dashboard.summary;

    const lowStock =
        dashboard.low_stock_products || [];

    const recentInventory =
        dashboard.recent_inventory || [];

    const recentOrders =
        dashboard.recent_orders || [];


    // ======================================================
    // STAT CARDS
    // ======================================================

    const stats = [

        {
            title: "Total Products",
            subtitle: "Different products registered",
            value: summary.total_products,
            icon: Package,
            bg: "bg-blue-50",
            iconBg: "bg-blue-100",
            color: "text-blue-600"
        },

        {
            title: "Items Currently in Stock",
            subtitle: "Total available quantity",
            value: summary.total_stock,
            icon: Boxes,
            bg: "bg-purple-50",
            iconBg: "bg-purple-100",
            color: "text-purple-600"
        },

        {
            title: "Total Suppliers",
            subtitle: "Registered suppliers",
            value: summary.total_suppliers,
            icon: Truck,
            bg: "bg-orange-50",
            iconBg: "bg-orange-100",
            color: "text-orange-600"
        },

        {
            title: "Total Customers",
            subtitle: "Registered customers",
            value: summary.total_customers,
            icon: Users,
            bg: "bg-cyan-50",
            iconBg: "bg-cyan-100",
            color: "text-cyan-600"
        },

        {
            title: "Customer Orders",
            subtitle: "Orders placed by customers",
            value: summary.total_customer_orders,
            icon: ClipboardList,
            bg: "bg-green-50",
            iconBg: "bg-green-100",
            color: "text-green-600"
        },

        {
            title: "Purchase Orders",
            subtitle: "Orders placed with suppliers",
            value: summary.total_purchase_orders,
            icon: ShoppingCart,
            bg: "bg-pink-50",
            iconBg: "bg-pink-100",
            color: "text-pink-600"
        }

    ];


    return (

        <div className="space-y-6">


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

                <div>

                    <h1 className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-gray-800
                        sm:text-3xl
                    ">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Here's what's happening in your inventory today.
                    </p>

                </div>


                <button
                    onClick={fetchDashboard}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-4
                        py-2.5
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
                STAT CARDS
            ================================================== */}

            <div className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                xl:grid-cols-3
            ">

                {stats.map((stat) => {

                    const Icon = stat.icon;

                    return (

                        <div
                            key={stat.title}
                            className={`
                                ${stat.bg}
                                rounded-2xl
                                border
                                border-white
                                p-5
                                shadow-sm
                                transition
                                hover:-translate-y-0.5
                                hover:shadow-md
                            `}
                        >

                            <div className="
                                flex
                                items-center
                                justify-between
                                gap-4
                            ">

                                <div className="min-w-0">

                                    <p className="
                                        text-sm
                                        font-semibold
                                        text-gray-600
                                    ">
                                        {stat.title}
                                    </p>

                                    <p className="
                                        mt-2
                                        text-3xl
                                        font-bold
                                        text-gray-800
                                    ">
                                        {Number(stat.value).toLocaleString("en-IN")}
                                    </p>

                                    <p className="
                                        mt-1
                                        text-xs
                                        text-gray-400
                                    ">
                                        {stat.subtitle}
                                    </p>

                                </div>


                                <div
                                    className={`
                                        ${stat.iconBg}
                                        ${stat.color}
                                        flex
                                        h-12
                                        w-12
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                    `}
                                >

                                    <Icon size={23} />

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>


            {/* ==================================================
                CUSTOMER SALES REVENUE + QUICK ACTIONS
            ================================================== */}

            <div className="
                grid
                grid-cols-1
                gap-5
                lg:grid-cols-3
            ">


                {/* Customer Sales Revenue */}

                <div className="
                    rounded-2xl
                    bg-gradient-to-br
                    from-emerald-500
                    to-green-600
                    p-6
                    text-white
                    shadow-sm
                    lg:col-span-2
                ">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-green-100
                            ">
                                Customer Sales Revenue
                            </p>

                            <p className="
                                mt-2
                                text-3xl
                                font-bold
                                sm:text-4xl
                            ">
                                ₹
                                {Number(
                                    summary.total_sales
                                ).toLocaleString("en-IN")}
                            </p>

                        </div>

                        <div className="
                            rounded-xl
                            bg-white/20
                            p-3
                        ">

                            <IndianRupee size={23} />

                        </div>

                    </div>

                    <p className="
                        mt-4
                        text-sm
                        text-green-100
                    ">
                        Total amount generated from customer orders
                    </p>

                </div>


                {/* Quick Actions */}

                <div className="
                    rounded-2xl
                    bg-white
                    p-5
                    shadow-sm
                ">

                    <h2 className="
                        font-bold
                        text-gray-800
                    ">
                        Quick Actions
                    </h2>

                    <p className="
                        mt-1
                        text-xs
                        text-gray-400
                    ">
                        Quickly access common operations
                    </p>

                    <div className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-3
                    ">


                        {/* Add Product */}

                        <button
                            onClick={() => navigate("/products/add")}
                            className="
                                flex
                                flex-col
                                items-center
                                gap-2
                                rounded-xl
                                bg-blue-50
                                p-3
                                text-xs
                                font-semibold
                                text-blue-700
                                transition
                                hover:bg-blue-100
                            "
                        >

                            <Plus size={19} />

                            Add Product

                        </button>


                        {/* Purchase */}

                        <button
                            onClick={() => navigate("/purchases")}
                            className="
                                flex
                                flex-col
                                items-center
                                gap-2
                                rounded-xl
                                bg-orange-50
                                p-3
                                text-xs
                                font-semibold
                                text-orange-700
                                transition
                                hover:bg-orange-100
                            "
                        >

                            <ShoppingCart size={19} />

                            Purchase

                        </button>


                        {/* Customer Order */}

                        <button
                            onClick={() => navigate("/customers")}
                            className="
                                flex
                                flex-col
                                items-center
                                gap-2
                                rounded-xl
                                bg-green-50
                                p-3
                                text-xs
                                font-semibold
                                text-green-700
                                transition
                                hover:bg-green-100
                            "
                        >

                            <Users size={19} />

                            Customer Order

                        </button>


                        {/* Inventory */}

                        <button
                            onClick={() => navigate("/inventory")}
                            className="
                                flex
                                flex-col
                                items-center
                                gap-2
                                rounded-xl
                                bg-purple-50
                                p-3
                                text-xs
                                font-semibold
                                text-purple-700
                                transition
                                hover:bg-purple-100
                            "
                        >

                            <ClipboardList size={19} />

                            Inventory

                        </button>

                    </div>

                </div>

            </div>


            {/* ==================================================
                RECENT ACTIVITY + LOW STOCK
            ================================================== */}

            <div className="
                grid
                grid-cols-1
                gap-5
                xl:grid-cols-2
            ">


                {/* Recent Inventory */}

                <div className="
                    overflow-hidden
                    rounded-2xl
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
                                font-bold
                                text-gray-800
                            ">
                                Recent Inventory Activity
                            </h2>

                            <p className="
                                mt-1
                                text-xs
                                text-gray-400
                            ">
                                Latest stock movements
                            </p>

                        </div>


                        <button
                            onClick={() => navigate("/inventory")}
                            className="
                                text-xs
                                font-semibold
                                text-blue-600
                                hover:text-blue-700
                            "
                        >
                            View All
                        </button>

                    </div>


                    <div className="divide-y divide-gray-100">

                        {recentInventory.length === 0 ? (

                            <div className="
                                p-8
                                text-center
                                text-sm
                                text-gray-400
                            ">
                                No inventory activity found.
                            </div>

                        ) : (

                            recentInventory.map((item) => {

                                const purchase =
                                    item.change_type === "PURCHASE";

                                return (

                                    <div
                                        key={item.inventory_id}
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-3
                                            p-4
                                            transition
                                            hover:bg-gray-50
                                        "
                                    >

                                        <div className="
                                            flex
                                            min-w-0
                                            items-center
                                            gap-3
                                        ">

                                            <div
                                                className={`
                                                    flex
                                                    h-9
                                                    w-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    ${purchase
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"
                                                    }
                                                `}
                                            >

                                                {purchase ? (

                                                    <ArrowDownToLine size={17} />

                                                ) : (

                                                    <ArrowUpFromLine size={17} />

                                                )}

                                            </div>


                                            <div className="min-w-0">

                                                <p className="
                                                    truncate
                                                    text-sm
                                                    font-semibold
                                                    text-gray-800
                                                ">
                                                    {item.product_name}
                                                </p>

                                                <p className="
                                                    text-xs
                                                    text-gray-400
                                                ">
                                                    {item.change_type === "PURCHASE"
                                                        ? "Stock added"
                                                        : "Stock sold"
                                                    }
                                                </p>

                                            </div>

                                        </div>


                                        <span
                                            className={`
                                                shrink-0
                                                text-sm
                                                font-bold
                                                ${Number(
                                                item.quantity_changed
                                            ) > 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                }
                                            `}
                                        >

                                            {Number(
                                                item.quantity_changed
                                            ) > 0
                                                ? "+"
                                                : ""}

                                            {item.quantity_changed}

                                        </span>

                                    </div>

                                );

                            })

                        )}

                    </div>

                </div>


                {/* Low Stock */}

                <div className="
                    overflow-hidden
                    rounded-2xl
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

                        <div className="flex items-center gap-3">

                            <div className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                bg-red-100
                                text-red-600
                            ">

                                <AlertTriangle size={18} />

                            </div>


                            <div>

                                <h2 className="
                                    font-bold
                                    text-gray-800
                                ">
                                    Low Stock Products
                                </h2>

                                <p className="
                                    text-xs
                                    text-gray-400
                                ">
                                    Products with 10 or fewer units available
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="divide-y divide-gray-100">

                        {lowStock.length === 0 ? (

                            <div className="p-8 text-center">

                                <Boxes
                                    size={35}
                                    className="mx-auto text-green-400"
                                />

                                <p className="
                                    mt-2
                                    text-sm
                                    font-semibold
                                    text-gray-600
                                ">
                                    All products have sufficient stock
                                </p>

                            </div>

                        ) : (

                            lowStock.map((item) => (

                                <div
                                    key={item.product_id}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        p-4
                                    "
                                >

                                    <div>

                                        <p className="
                                            text-sm
                                            font-semibold
                                            text-gray-800
                                        ">
                                            {item.product_name}
                                        </p>

                                        <p className="
                                            text-xs
                                            text-gray-400
                                        ">
                                            Product #{item.product_id}
                                        </p>

                                    </div>


                                    <span className="
                                        rounded-full
                                        bg-red-100
                                        px-3
                                        py-1
                                        text-xs
                                        font-bold
                                        text-red-700
                                    ">
                                        {item.stock_quantity} units available
                                    </span>

                                </div>

                            ))

                        )}

                    </div>

                </div>

            </div>


            {/* ==================================================
                RECENT CUSTOMER ORDERS
            ================================================== */}

            <div className="
                overflow-hidden
                rounded-2xl
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
                            font-bold
                            text-gray-800
                        ">
                            Recent Customer Orders
                        </h2>

                        <p className="
                            mt-1
                            text-xs
                            text-gray-400
                        ">
                            Latest orders placed by customers
                        </p>

                    </div>


                    <button
                        onClick={() => navigate("/customers")}
                        className="
                            flex
                            items-center
                            gap-1
                            text-xs
                            font-semibold
                            text-blue-600
                            hover:text-blue-700
                        "
                    >

                        <Eye size={15} />

                        View All

                    </button>

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
                                    Payment Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {recentOrders.length === 0 ? (

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
                                        No customer orders found.
                                    </td>

                                </tr>

                            ) : (

                                recentOrders.map((order) => (

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
                                            {order.customer_name}
                                        </td>


                                        <td className="
                                            px-5
                                            py-4
                                            text-sm
                                            text-gray-500
                                        ">
                                            {new Date(
                                                order.order_date
                                            ).toLocaleDateString("en-IN")}
                                        </td>


                                        <td className="
                                            px-5
                                            py-4
                                            text-right
                                            text-sm
                                            font-bold
                                            text-gray-800
                                        ">
                                            ₹
                                            {Number(
                                                order.total_amount
                                            ).toLocaleString("en-IN")}
                                        </td>


                                        <td className="
                                            px-5
                                            py-4
                                            text-center
                                        ">

                                            <span className="
                                                rounded-full
                                                bg-green-100
                                                px-3
                                                py-1
                                                text-xs
                                                font-bold
                                                text-green-700
                                            ">
                                                {order.payment_status}
                                            </span>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


        </div>
    );
};


export default Dashboard;