import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    ClipboardList,
    Package,
    ArrowDownToLine,
    ArrowUpFromLine,
    RefreshCw,
} from "lucide-react";

const InventoryList = () => {

    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ======================================================
    // FETCH INVENTORY
    // ======================================================

    const fetchInventory = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/inventory"
            );

            console.log("Inventory data:", response.data);

            setInventory(response.data.inventory || []);

        } catch (error) {

            console.error("Fetch inventory error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch inventory records"
            );

        } finally {

            setLoading(false);

        }
    };


    // ======================================================
    // PAGE LOAD
    // ======================================================

    useEffect(() => {

        fetchInventory();

    }, []);


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {

        return (
            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="text-center">

                    <RefreshCw
                        size={30}
                        className="mx-auto animate-spin text-cyan-600"
                    />

                    <p className="mt-3 font-semibold text-gray-600">
                        Loading inventory records...
                    </p>

                </div>

            </div>
        );

    }


    // ======================================================
    // TOTAL PURCHASES / SALES
    // ======================================================

    const purchaseCount = inventory.filter(
        (item) => item.change_type === "PURCHASE"
    ).length;

    const saleCount = inventory.filter(
        (item) => item.change_type === "SALE"
    ).length;


    // ======================================================
    // UI
    // ======================================================

    return (

        <div className="space-y-6">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex h-11 w-11
                                items-center justify-center
                                rounded-xl
                                bg-cyan-50
                                text-cyan-600
                            "
                        >
                            <ClipboardList size={23} />
                        </div>

                        <div>

                            <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                                Inventory Record
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Track all stock movements and inventory changes
                            </p>

                        </div>

                    </div>

                </div>


                {/* Refresh Button */}

                <button
                    onClick={fetchInventory}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
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
                ERROR
            ================================================== */}

            {error && (

                <div
                    className="
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        p-4
                        text-red-600
                    "
                >

                    <p className="font-semibold">
                        Error
                    </p>

                    <p className="mt-1 text-sm">
                        {error}
                    </p>

                </div>

            )}


            {/* ==================================================
                SUMMARY CARDS
            ================================================== */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">


                {/* Total */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-gray-100
                        bg-white
                        p-5
                        shadow-sm
                    "
                >

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-medium text-gray-500">
                                Total Records
                            </p>

                            <p className="mt-2 text-3xl font-bold text-gray-800">
                                {inventory.length}
                            </p>

                        </div>

                        <div
                            className="
                                flex h-11 w-11
                                items-center justify-center
                                rounded-xl
                                bg-gray-100
                                text-gray-600
                            "
                        >
                            <ClipboardList size={21} />
                        </div>

                    </div>

                </div>


                {/* Purchases */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-green-100
                        bg-green-50/60
                        p-5
                        shadow-sm
                    "
                >

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-medium text-green-700">
                                Purchase Records
                            </p>

                            <p className="mt-2 text-3xl font-bold text-green-700">
                                {purchaseCount}
                            </p>

                        </div>

                        <div
                            className="
                                flex h-11 w-11
                                items-center justify-center
                                rounded-xl
                                bg-green-100
                                text-green-600
                            "
                        >
                            <ArrowDownToLine size={21} />
                        </div>

                    </div>

                </div>


                {/* Sales */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-red-100
                        bg-red-50/60
                        p-5
                        shadow-sm
                    "
                >

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-medium text-red-700">
                                Sale Records
                            </p>

                            <p className="mt-2 text-3xl font-bold text-red-700">
                                {saleCount}
                            </p>

                        </div>

                        <div
                            className="
                                flex h-11 w-11
                                items-center justify-center
                                rounded-xl
                                bg-red-100
                                text-red-600
                            "
                        >
                            <ArrowUpFromLine size={21} />
                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                DESKTOP TABLE
            ================================================== */}

            <div
                className="
                    hidden
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    shadow-sm
                    md:block
                "
            >

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr
                                className="
                                    border-b
                                    border-gray-200
                                    bg-gray-50
                                "
                            >

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Inventory ID
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Product
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Product ID
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Change Type
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Quantity Changed
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {inventory.map((item) => {

                                const isPurchase =
                                    item.change_type === "PURCHASE";

                                return (

                                    <tr
                                        key={item.inventory_id}
                                        className="
                                            border-b
                                            border-gray-100
                                            transition
                                            hover:bg-gray-50
                                        "
                                    >

                                        {/* Inventory ID */}

                                        <td className="px-6 py-4">

                                            <span
                                                className="
                                                    font-semibold
                                                    text-gray-700
                                                "
                                            >
                                                #{item.inventory_id}
                                            </span>

                                        </td>


                                        {/* Product */}

                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                <div
                                                    className="
                                                        flex h-9 w-9
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-gray-100
                                                        text-gray-600
                                                    "
                                                >
                                                    <Package size={18} />
                                                </div>

                                                <div>

                                                    <p className="font-semibold text-gray-800">
                                                        {item.product_name}
                                                    </p>

                                                    <p className="text-xs text-gray-400">
                                                        Product #{item.product_id}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* Product ID */}

                                        <td className="px-6 py-4">

                                            <span className="text-gray-600">
                                                {item.product_id}
                                            </span>

                                        </td>


                                        {/* Change Type */}

                                        <td className="px-6 py-4">

                                            <span
                                                className={`
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    rounded-full
                                                    px-3
                                                    py-1.5
                                                    text-xs
                                                    font-bold

                                                    ${isPurchase
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }
                                                `}
                                            >

                                                {isPurchase ? (
                                                    <ArrowDownToLine size={14} />
                                                ) : (
                                                    <ArrowUpFromLine size={14} />
                                                )}

                                                {item.change_type}

                                            </span>

                                        </td>


                                        {/* Quantity */}

                                        <td className="px-6 py-4">

                                            <span
                                                className={`
                                                    text-lg
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

                                        </td>

                                    </tr>

                                );

                            })}


                            {/* Empty */}

                            {inventory.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="
                                            px-6
                                            py-14
                                            text-center
                                            text-gray-500
                                        "
                                    >

                                        <ClipboardList
                                            size={40}
                                            className="mx-auto mb-3 text-gray-300"
                                        />

                                        <p className="font-semibold">
                                            No inventory records found
                                        </p>

                                        <p className="mt-1 text-sm">
                                            Inventory movements will appear here.
                                        </p>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ==================================================
                MOBILE CARDS
            ================================================== */}

            <div className="space-y-4 md:hidden">

                {inventory.map((item) => {

                    const isPurchase =
                        item.change_type === "PURCHASE";

                    return (

                        <div
                            key={item.inventory_id}
                            className="
                                rounded-2xl
                                border
                                border-gray-100
                                bg-white
                                p-5
                                shadow-sm
                            "
                        >

                            {/* Top */}

                            <div className="flex items-start justify-between gap-3">

                                <div>

                                    <p className="text-xs font-medium text-gray-400">
                                        Inventory #{item.inventory_id}
                                    </p>

                                    <h2 className="mt-1 font-bold text-gray-800">
                                        {item.product_name}
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Product ID: {item.product_id}
                                    </p>

                                </div>


                                {/* Type */}

                                <span
                                    className={`
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-full
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-bold

                                        ${isPurchase
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }
                                    `}
                                >

                                    {isPurchase ? (
                                        <ArrowDownToLine size={13} />
                                    ) : (
                                        <ArrowUpFromLine size={13} />
                                    )}

                                    {item.change_type}

                                </span>

                            </div>


                            {/* Bottom */}

                            <div
                                className="
                                    mt-4
                                    flex
                                    items-center
                                    justify-between
                                    border-t
                                    border-gray-100
                                    pt-4
                                "
                            >

                                <span className="text-sm text-gray-500">
                                    Quantity Changed
                                </span>

                                <span
                                    className={`
                                        text-xl
                                        font-bold

                                        ${Number(
                                        item.quantity_changed
                                    ) > 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }
                                    `}
                                >
                                    {Number(item.quantity_changed) > 0
                                        ? "+"
                                        : ""}
                                    {item.quantity_changed}
                                </span>

                            </div>

                        </div>

                    );

                })}


                {inventory.length === 0 && (

                    <div
                        className="
                            rounded-2xl
                            bg-white
                            p-10
                            text-center
                            shadow-sm
                        "
                    >

                        <ClipboardList
                            size={40}
                            className="mx-auto mb-3 text-gray-300"
                        />

                        <p className="font-semibold text-gray-700">
                            No inventory records found
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
};

export default InventoryList;