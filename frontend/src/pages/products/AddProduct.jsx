import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProduct = () => {
    const navigate = useNavigate();

    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {
            setLoading(true);

            // Send product data to backend
            const response = await axios.post(
                "http://localhost:5000/api/products",
                {
                    product_name: productName,
                    price: Number(price),
                }
            );

            console.log("Product added:", response.data);

            // Clear form
            setProductName("");
            setPrice("");

            // Go back to product list
            navigate("/products");

        } catch (error) {
            console.error("Add product error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to add product"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-3xl">

            {/* Page Header */}

            <div className="mb-6">

                <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                    Add Product
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Add a new product to your inventory
                </p>

            </div>


            {/* Error */}

            {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}


            {/* Form */}

            <div className="rounded-xl bg-white p-5 shadow-sm sm:p-7">

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Product Name */}

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


                    {/* Price */}

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


                    {/* Buttons */}

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                            {loading
                                ? "Adding Product..."
                                : "Add Product"}
                        </button>


                        <button
                            type="button"
                            onClick={() => navigate("/products")}
                            className="w-full rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-300 sm:w-auto"
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default AddProduct;