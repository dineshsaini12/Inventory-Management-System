import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [deleteLoading, setDeleteLoading] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [deleteError, setDeleteError] = useState("");

    const fetchProducts = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/products"
            );

            console.log("Products:", response.data);

            setProducts(response.data.products || []);

        } catch (error) {

            console.error("Error:", error);

            setError("Failed to fetch products");

        } finally {

            setLoading(false);

        }
    };

    //deleter products with error if not able to delete

    const handleDelete = async (productId, productName) => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${productName}"?`
        );

        if (!confirmDelete) {
            return;
        }

        try {

            setDeleteLoading(productId);
            setDeleteError("");
            setSuccessMessage("");

            await axios.delete(
                `http://localhost:5000/api/products/${productId}`
            );

            setSuccessMessage(
                `"${productName}" deleted successfully.`
            );

            // Refresh product list
            fetchProducts();

        } catch (error) {

            console.error("Delete product error:", error);

            const backendMessage =
                error.response?.data?.message;

            const backendError =
                error.response?.data?.error || "";

            if (
                backendError.includes("foreign key constraint") ||
                backendError.includes("Cannot delete or update a parent row")
            ) {

                setDeleteError(
                    `"${productName}" cannot be deleted because it is already used in an order or another transaction.`
                );

            } else {

                setDeleteError(
                    backendMessage ||
                    "Unable to delete this product. Please try again."
                );

            }

        } finally {

            setDeleteLoading(null);

        }
    };

    useEffect(() => {

        fetchProducts();


    }, []);


    // Loading

    if (loading) {

        return (
            <div className="flex min-h-[60vh] items-center justify-center">

                <p className="text-lg font-semibold text-gray-600">
                    Loading products...
                </p>

            </div>
        );

    }


    return (

        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                        Products
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your inventory products
                    </p>

                </div>


                <Link
                    to="/products/add"
                    className="rounded-lg bg-blue-600 px-5 py-3 text-center font-medium text-white hover:bg-blue-700"
                >
                    + Add Product
                </Link>

            </div>
            {/* SUCCESS MESSAGE */}

            {successMessage && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
                    <p className="font-semibold">
                        Success
                    </p>

                    <p className="mt-1 text-sm">
                        {successMessage}
                    </p>
                </div>
            )}


            {/* DELETE ERROR */}

            {deleteError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    <p className="font-semibold">
                        Cannot Delete Product
                    </p>

                    <p className="mt-1 text-sm">
                        {deleteError}
                    </p>
                </div>
            )}

            {/* ERROR */}

            {error && (

                <div className="rounded-lg bg-red-50 p-4 text-red-600">

                    {error}

                </div>

            )}


            {/* PRODUCT COUNT */}

            <div className="rounded-xl bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-500">
                    Total Products
                </p>

                <p className="mt-1 text-3xl font-bold text-gray-800">
                    {products.length}
                </p>

            </div>


            {/* TABLE */}

            <div className="overflow-x-auto rounded-xl bg-white shadow-sm">

                <table className="w-full min-w-[500px]">

                    <thead className="bg-gray-800 text-white">

                        <tr>

                            <th className="px-6 py-4 text-left">
                                ID
                            </th>

                            <th className="px-6 py-4 text-left">
                                Product Name
                            </th>

                            <th className="px-6 py-4 text-left">
                                Price
                            </th>

                            <th className="px-6 py-4 text-left">
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {products.map((product) => (

                            <tr
                                key={product.product_id}
                                className="border-b hover:bg-gray-50"
                            >

                                <td className="px-6 py-4">
                                    {product.product_id}
                                </td>

                                <td className="px-6 py-4 font-medium">
                                    {product.product_name}
                                </td>

                                <td className="px-6 py-4">
                                    ₹{product.price}
                                </td>

                                <td className="px-6 py-4">

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                product.product_id,
                                                product.product_name
                                            )
                                        }
                                        disabled={deleteLoading === product.product_id}
                                        className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {deleteLoading === product.product_id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>

                                </td>
                            </tr>

                        ))}


                        {/* No products */}

                        {products.length === 0 && (

                            <tr>

                                <td
                                    colSpan="3"
                                    className="px-6 py-8 text-center text-gray-500"
                                >
                                    No products found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );
};

export default ProductList;