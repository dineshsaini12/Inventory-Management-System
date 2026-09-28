import React, { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
    // Store products coming from MySQL
    const [products, setProducts] = useState([]);

    // Form data
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");

    // Show/hide form
    const [showForm, setShowForm] = useState(false);

    // Loading and error
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // GET ALL PRODUCTS
    // =========================

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/products"
            );

            setProducts(response.data.products);
        } catch (error) {
            console.error(error);
            setError("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    // Run when page loads
    useEffect(() => {
        fetchProducts();
    }, []);

    // =========================
    // ADD PRODUCT
    // =========================

    const handleAddProduct = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                "http://localhost:5000/api/products",
                {
                    product_name: productName,
                    price: Number(price),
                }
            );

            // Clear form
            setProductName("");
            setPrice("");

            // Close form
            setShowForm(false);

            // Refresh products
            fetchProducts();

        } catch (error) {
            console.error(error);
            alert("Failed to add product");
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
                <p className="text-lg font-semibold text-gray-700 sm:text-xl">
                    Loading products...
                </p>
            </div>
        );
    }

    // =========================
    // UI
    // =========================

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">

            <div className="mx-auto w-full max-w-7xl">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
                            Products
                        </h1>

                        <p className="mt-1 text-sm text-gray-500 sm:text-base">
                            Manage your inventory products
                        </p>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 active:scale-95 sm:w-auto"
                    >
                        {showForm ? "Close" : "+ Add Product"}
                    </button>

                </div>


                {/* =========================
                    ERROR
                ========================= */}

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}


                {/* =========================
                    ADD PRODUCT FORM
                ========================= */}

                {showForm && (
                    <div className="mb-6 rounded-xl bg-white p-4 shadow-sm sm:p-6">

                        <h2 className="mb-5 text-xl font-semibold text-gray-800">
                            Add Product
                        </h2>

                        <form
                            onSubmit={handleAddProduct}
                            className="grid grid-cols-1 gap-5 md:grid-cols-2"
                        >

                            {/* PRODUCT NAME */}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    value={productName}
                                    onChange={(e) =>
                                        setProductName(e.target.value)
                                    }
                                    placeholder="Enter product name"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>


                            {/* PRICE */}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Price
                                </label>

                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(e.target.value)
                                    }
                                    placeholder="Enter price"
                                    min="0"
                                    step="0.01"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>


                            {/* BUTTON */}

                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700 active:scale-[0.99] sm:w-auto"
                                >
                                    Add Product
                                </button>
                            </div>

                        </form>
                    </div>
                )}


                {/* =========================
                    PRODUCT COUNT
                ========================= */}

                <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">

                    <p className="text-sm text-gray-500">
                        Total Products
                    </p>

                    <p className="text-2xl font-bold text-gray-800">
                        {products.length}
                    </p>

                </div>


                {/* =================================================
                    DESKTOP / TABLET TABLE
                    hidden on small mobile screens
                ================================================= */}

                <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm md:block">

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-800 text-white">

                                <tr>

                                    <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold">
                                        ID
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold">
                                        Product Name
                                    </th>

                                    <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold">
                                        Price
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {products.map((product) => (

                                    <tr
                                        key={product.product_id}
                                        className="border-b border-gray-100 transition hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {product.product_id}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {product.product_name}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            ₹{product.price}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* =================================================
                    MOBILE PRODUCT CARDS
                    visible only on small screens
                ================================================= */}

                <div className="space-y-4 md:hidden">

                    {products.map((product) => (

                        <div
                            key={product.product_id}
                            className="rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
                        >

                            <div className="mb-3 flex items-center justify-between">

                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                    ID: {product.product_id}
                                </span>

                                <span className="text-lg font-bold text-green-600">
                                    ₹{product.price}
                                </span>

                            </div>

                            <h3 className="break-words text-lg font-semibold text-gray-800">
                                {product.product_name}
                            </h3>

                        </div>

                    ))}

                </div>


                {/* EMPTY STATE */}

                {products.length === 0 && (

                    <div className="rounded-xl bg-white p-8 text-center shadow-sm">

                        <p className="text-gray-500">
                            No products found.
                        </p>

                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Add Your First Product
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
};

export default Products;