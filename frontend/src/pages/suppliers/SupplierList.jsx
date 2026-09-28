import React, { useEffect, useState } from "react";
import axios from "axios";

const SupplierList = () => {

    // Supplier data
    const [suppliers, setSuppliers] = useState([]);

    // Form
    const [showForm, setShowForm] = useState(false);

    const [supplierName, setSupplierName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    // Loading / messages
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [deleteError, setDeleteError] = useState("");

    const [deleteLoading, setDeleteLoading] = useState(null);


    // ==========================================
    // GET ALL SUPPLIERS
    // ==========================================

    const fetchSuppliers = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/suppliers"
            );

            setSuppliers(response.data.suppliers || []);

        } catch (error) {

            console.error("Fetch suppliers error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch suppliers"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // LOAD SUPPLIERS
    // ==========================================

    useEffect(() => {

        fetchSuppliers();

    }, []);


    // ==========================================
    // ADD SUPPLIER
    // ==========================================

    const handleAddSupplier = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);
            setError("");
            setSuccessMessage("");
            setDeleteError("");

            await axios.post(
                "http://localhost:5000/api/suppliers",
                {
                    supplier_name: supplierName,
                    phone_no: phoneNo,
                    email: email,
                    address: address
                }
            );


            // Clear form

            setSupplierName("");
            setPhoneNo("");
            setEmail("");
            setAddress("");


            // Close form

            setShowForm(false);


            // Success message

            setSuccessMessage(
                "Supplier added successfully."
            );


            // Refresh supplier list

            fetchSuppliers();

        } catch (error) {

            console.error("Add supplier error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to add supplier"
            );

        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // DELETE SUPPLIER
    // ==========================================

    const handleDelete = async (
        supplierId,
        supplierName
    ) => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${supplierName}"?`
        );

        if (!confirmDelete) {
            return;
        }


        try {

            setDeleteLoading(supplierId);
            setDeleteError("");
            setSuccessMessage("");
            setError("");


            await axios.delete(
                `http://localhost:5000/api/suppliers/${supplierId}`
            );


            setSuccessMessage(
                `"${supplierName}" deleted successfully.`
            );


            fetchSuppliers();

        } catch (error) {

            console.error("Delete supplier error:", error);


            const backendError =
                error.response?.data?.error || "";


            if (
                backendError.includes(
                    "foreign key constraint"
                )
            ) {

                setDeleteError(
                    `"${supplierName}" cannot be deleted because it is already used in a purchase order.`
                );

            } else {

                setDeleteError(
                    error.response?.data?.message ||
                    "Unable to delete this supplier."
                );

            }

        } finally {

            setDeleteLoading(null);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="flex min-h-[60vh] items-center justify-center">

                <p className="text-lg font-semibold text-gray-600">
                    Loading suppliers...
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
                        Suppliers
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your suppliers
                    </p>

                </div>


                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setError("");
                        setSuccessMessage("");
                        setDeleteError("");
                    }}
                    className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 sm:w-auto"
                >
                    {showForm
                        ? "Close"
                        : "+ Add Supplier"
                    }
                </button>

            </div>


            {/* SUCCESS MESSAGE */}

            {successMessage && (

                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">

                    <p className="font-semibold">
                        Success
                    </p>

                    <p className="mt-1 text-sm">
                        {successMessage}
                    </p>

                </div>

            )}


            {/* ERROR MESSAGE */}

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


            {/* DELETE ERROR */}

            {deleteError && (

                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">

                    <p className="font-semibold">
                        Cannot Delete Supplier
                    </p>

                    <p className="mt-1 text-sm">
                        {deleteError}
                    </p>

                </div>

            )}


            {/* ==========================================
                ADD SUPPLIER FORM
            ========================================== */}

            {showForm && (

                <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

                    <h2 className="mb-5 text-xl font-semibold text-gray-800">
                        Add Supplier
                    </h2>


                    <form
                        onSubmit={handleAddSupplier}
                        className="grid grid-cols-1 gap-5 md:grid-cols-2"
                    >


                        {/* SUPPLIER NAME */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Supplier Name
                            </label>

                            <input
                                type="text"
                                value={supplierName}
                                onChange={(e) =>
                                    setSupplierName(e.target.value)
                                }
                                placeholder="Enter supplier name"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                            />

                        </div>


                        {/* PHONE */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                value={phoneNo}
                                onChange={(e) =>
                                    setPhoneNo(e.target.value)
                                }
                                placeholder="Enter phone number"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                            />

                        </div>


                        {/* EMAIL */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter email"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                            />

                        </div>


                        {/* ADDRESS */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Address
                            </label>

                            <input
                                type="text"
                                value={address}
                                onChange={(e) =>
                                    setAddress(e.target.value)
                                }
                                placeholder="Enter address"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                            />

                        </div>


                        {/* SUBMIT */}

                        <div className="md:col-span-2">

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Add Supplier"
                                }
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* ==========================================
                SUPPLIER TABLE - DESKTOP
            ========================================== */}

            <div className="hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">

                <table className="w-full">

                    <thead className="bg-gray-800 text-white">

                        <tr>

                            <th className="px-6 py-4 text-left">
                                ID
                            </th>

                            <th className="px-6 py-4 text-left">
                                Supplier Name
                            </th>

                            <th className="px-6 py-4 text-left">
                                Phone
                            </th>

                            <th className="px-6 py-4 text-left">
                                Email
                            </th>

                            <th className="px-6 py-4 text-left">
                                Address
                            </th>

                            <th className="px-6 py-4 text-left">
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {suppliers.map((supplier) => (

                            <tr
                                key={supplier.supplier_id}
                                className="border-b transition hover:bg-gray-50"
                            >

                                <td className="px-6 py-4">
                                    {supplier.supplier_id}
                                </td>

                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {supplier.supplier_name}
                                </td>

                                <td className="px-6 py-4">
                                    {supplier.phone_no || "-"}
                                </td>

                                <td className="px-6 py-4">
                                    {supplier.email || "-"}
                                </td>

                                <td className="px-6 py-4">
                                    {supplier.address || "-"}
                                </td>

                                <td className="px-6 py-4">

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                supplier.supplier_id,
                                                supplier.supplier_name
                                            )
                                        }
                                        disabled={
                                            deleteLoading ===
                                            supplier.supplier_id
                                        }
                                        className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {deleteLoading ===
                                            supplier.supplier_id
                                            ? "Deleting..."
                                            : "Delete"
                                        }
                                    </button>

                                </td>

                            </tr>

                        ))}


                        {suppliers.length === 0 && (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="px-6 py-10 text-center text-gray-500"
                                >
                                    No suppliers found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>


            {/* ==========================================
                SUPPLIER CARDS - MOBILE
            ========================================== */}

            <div className="space-y-4 md:hidden">

                {suppliers.map((supplier) => (

                    <div
                        key={supplier.supplier_id}
                        className="rounded-xl bg-white p-5 shadow-sm"
                    >

                        <div className="flex items-start justify-between gap-4">

                            <div>

                                <p className="text-xs text-gray-500">
                                    Supplier ID: {supplier.supplier_id}
                                </p>

                                <h2 className="mt-1 text-lg font-semibold text-gray-800">
                                    {supplier.supplier_name}
                                </h2>

                            </div>

                        </div>


                        <div className="mt-4 space-y-3 border-t pt-4">

                            <div>

                                <p className="text-xs text-gray-500">
                                    Phone
                                </p>

                                <p className="text-sm font-medium text-gray-800">
                                    {supplier.phone_no || "-"}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs text-gray-500">
                                    Email
                                </p>

                                <p className="break-all text-sm font-medium text-gray-800">
                                    {supplier.email || "-"}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs text-gray-500">
                                    Address
                                </p>

                                <p className="text-sm font-medium text-gray-800">
                                    {supplier.address || "-"}
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    handleDelete(
                                        supplier.supplier_id,
                                        supplier.supplier_name
                                    )
                                }
                                disabled={
                                    deleteLoading ===
                                    supplier.supplier_id
                                }
                                className="w-full rounded-lg bg-red-100 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deleteLoading ===
                                    supplier.supplier_id
                                    ? "Deleting..."
                                    : "Delete Supplier"
                                }
                            </button>

                        </div>

                    </div>

                ))}


                {suppliers.length === 0 && (

                    <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
                        No suppliers found.
                    </div>

                )}

            </div>

        </div>

    );
};

export default SupplierList;