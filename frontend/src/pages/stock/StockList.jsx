import React, { useEffect, useState } from "react";
import axios from "axios";

const StockList = () => {

    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // GET STOCK
    // ==========================================

    const fetchStock = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/stock"
            );

            console.log("Stock data:", response.data);

            setStock(response.data.stock || []);

        } catch (error) {

            console.error("Fetch stock error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch stock"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // RUN WHEN PAGE LOADS
    // ==========================================

    useEffect(() => {

        fetchStock();

    }, []);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="flex min-h-[60vh] items-center justify-center">

                <p className="text-lg font-semibold text-gray-600">
                    Loading stock...
                </p>

            </div>
        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                        Stock Management
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View current stock of your products
                    </p>

                </div>

                <button
                    type="button"
                    onClick={fetchStock}
                    disabled={loading}
                    className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Refreshing..." : "Refresh Stock"}
                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">

                    <p className="font-semibold">
                        Error
                    </p>

                    <p className="mt-1 text-sm">
                        {error}
                    </p>

                </div>

            )}


            {/* TOTAL PRODUCTS */}

            <div className="rounded-xl bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-500">
                    Total Products
                </p>

                <p className="mt-1 text-3xl font-bold text-gray-800">
                    {stock.length}
                </p>

            </div>


            {/* DESKTOP TABLE */}

            <div className="hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">

                <table className="w-full">

                    <thead className="bg-gray-800 text-white">

                        <tr>

                            <th className="px-6 py-4 text-left">
                                Product ID
                            </th>

                            <th className="px-6 py-4 text-left">
                                Product Name
                            </th>

                            <th className="px-6 py-4 text-left">
                                Price
                            </th>

                            <th className="px-6 py-4 text-left">
                                Stock Quantity
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {stock.map((item) => (

                            <tr
                                key={item.product_id}
                                className="border-b hover:bg-gray-50"
                            >

                                <td className="px-6 py-4">
                                    {item.product_id}
                                </td>

                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {item.product_name}
                                </td>

                                <td className="px-6 py-4">
                                    ₹{item.price}
                                </td>

                                <td className="px-6 py-4">

                                    <span
                                        className={
                                            item.stock_quantity === 0
                                                ? "font-semibold text-red-600"
                                                : item.stock_quantity <= 10
                                                    ? "font-semibold text-orange-600"
                                                    : "font-semibold text-green-600"
                                        }
                                    >
                                        {item.stock_quantity}
                                    </span>

                                </td>

                            </tr>

                        ))}


                        {stock.length === 0 && (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="px-6 py-10 text-center text-gray-500"
                                >
                                    No stock records found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>


            {/* MOBILE CARDS */}

            <div className="space-y-4 md:hidden">

                {stock.map((item) => (

                    <div
                        key={item.product_id}
                        className="rounded-xl bg-white p-5 shadow-sm"
                    >

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-xs text-gray-500">
                                    Product ID: {item.product_id}
                                </p>

                                <h2 className="mt-1 text-lg font-semibold text-gray-800">
                                    {item.product_name}
                                </h2>

                            </div>


                            <span
                                className={
                                    item.stock_quantity === 0
                                        ? "rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600"
                                        : item.stock_quantity <= 10
                                            ? "rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600"
                                            : "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600"
                                }
                            >
                                {item.stock_quantity} units
                            </span>

                        </div>


                        <div className="mt-4 border-t pt-4">

                            <p className="text-sm text-gray-500">
                                Price
                            </p>

                            <p className="mt-1 font-semibold text-gray-800">
                                ₹{item.price}
                            </p>

                        </div>

                    </div>

                ))}


                {stock.length === 0 && (

                    <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
                        No stock records found.
                    </div>

                )}

            </div>

        </div>

    );
};

export default StockList;