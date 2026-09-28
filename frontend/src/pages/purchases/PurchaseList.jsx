import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Eye } from "lucide-react";
const PurchaseList = () => {

    // ==========================================
    // DATA
    // ==========================================

    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [purchases, setPurchases] = useState([]);

    // ==========================================
    // FORM
    // ==========================================

    const [showForm, setShowForm] = useState(false);

    const [supplierId, setSupplierId] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [expectedDate, setExpectedDate] = useState("");

    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unitPrice, setUnitPrice] = useState("");

    //pruchase details items 
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);

    // Animation origin of the eye button
    const [detailsOrigin, setDetailsOrigin] = useState({
        x: 50,
        y: 50
    });
    // Products added to current purchase
    const [items, setItems] = useState([]);

    // ==========================================
    // UI STATES
    // ==========================================

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


    // ==========================================
    // FETCH SUPPLIERS
    // ==========================================

    const fetchSuppliers = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/suppliers"
            );

            setSuppliers(response.data.suppliers || []);

        } catch (error) {

            console.error("Supplier error:", error);

            setError("Failed to fetch suppliers");

        }

    };


    // ==========================================
    // FETCH PRODUCTS
    // ==========================================

    const fetchProducts = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/products"
            );

            setProducts(response.data.products || []);

        } catch (error) {

            console.error("Product error:", error);

            setError("Failed to fetch products");

        }

    };


    // ==========================================
    // FETCH PURCHASES
    // ==========================================

    const fetchPurchases = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/purchases"
            );

            console.log("Purchase API response:", response.data);

            setPurchases(response.data.purchases || []);

        } catch (error) {
            console.error("Purchase fetch error:", error);

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch purchases"
            );
        }
    };


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await Promise.all([
                fetchSuppliers(),
                fetchProducts(),
                fetchPurchases()
            ]);

            setLoading(false);

        };

        loadData();

    }, []);


    // ==========================================
    // ADD PRODUCT TO PURCHASE
    // ==========================================

    const handleAddItem = () => {

        setError("");
        setSuccessMessage("");


        if (!productId) {

            setError("Please select a product");

            return;

        }


        if (!quantity || Number(quantity) <= 0) {

            setError("Please enter a valid quantity");

            return;

        }


        if (
            unitPrice === "" ||
            Number(unitPrice) < 0
        ) {

            setError("Please enter a valid unit price");

            return;

        }


        const selectedProduct = products.find(
            (product) =>
                product.product_id === Number(productId)
        );


        if (!selectedProduct) {

            setError("Product not found");

            return;

        }


        const newItem = {

            product_id: Number(productId),

            product_name:
                selectedProduct.product_name,

            quantity: Number(quantity),

            unit_price: Number(unitPrice),

            total_price:
                Number(quantity) *
                Number(unitPrice)

        };


        setItems((previousItems) => [
            ...previousItems,
            newItem
        ]);


        // Clear item form

        setProductId("");
        setQuantity("");
        setUnitPrice("");

    };


    // ==========================================
    // REMOVE ITEM
    // ==========================================

    const handleRemoveItem = (index) => {

        setItems((previousItems) =>
            previousItems.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );

    };


    // ==========================================
    // TOTAL AMOUNT
    // ==========================================

    const totalAmount = items.reduce(
        (total, item) =>
            total + item.total_price,
        0
    );


    // ==========================================
    // CREATE PURCHASE
    // ==========================================

    const handleCreatePurchase = async (e) => {

        e.preventDefault();

        setError("");
        setSuccessMessage("");


        if (!supplierId) {

            setError("Please select a supplier");

            return;

        }


        if (items.length === 0) {

            setError(
                "Please add at least one product"
            );

            return;

        }


        try {

            setSaving(true);


            await axios.post(
                "http://localhost:5000/api/purchases",
                {
                    supplier_id:
                        Number(supplierId),

                    order_date:
                        orderDate || null,

                    expected_date:
                        expectedDate || null,

                    purchase_status:
                        "Pending",

                    items: items.map((item) => ({

                        product_id:
                            item.product_id,

                        quantity:
                            item.quantity,

                        unit_price:
                            item.unit_price

                    }))

                }
            );


            setSuccessMessage(
                "Purchase order created successfully."
            );


            // Reset form

            setSupplierId("");
            setOrderDate("");
            setExpectedDate("");

            setItems([]);

            setShowForm(false);


            // Refresh purchases

            fetchPurchases();

        } catch (error) {

            console.error(
                "Create purchase error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to create purchase"
            );

        } finally {

            setSaving(false);

        }

    };


    const handleReceivePurchase = async (purchaseId) => {
        setError("");
        setSuccessMessage("");

        try {
            const response = await axios.put(
                `http://localhost:5000/api/purchases/${purchaseId}/receive`
            );

            setSuccessMessage(
                response.data.message ||
                "Purchase received successfully."
            );

            // Refresh purchase list
            await fetchPurchases();

        } catch (error) {
            console.error("Receive purchase error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to receive purchase"
            );
        }
    };


    const handleCancelPurchase = async (purchaseId) => {
        setError("");
        setSuccessMessage("");

        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this purchase?"
        );

        if (!confirmCancel) {
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/api/purchases/${purchaseId}/cancel`
            );

            setSuccessMessage(
                response.data.message ||
                "Purchase cancelled successfully."
            );

            // Refresh purchase list
            await fetchPurchases();

        } catch (error) {
            console.error("Cancel purchase error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to cancel purchase"
            );
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="flex min-h-[60vh] items-center justify-center">

                <p className="text-lg font-semibold text-gray-600">
                    Loading purchases...
                </p>

            </div>

        );

    }

    // ==========================================
    //handle view detaols of purchase
    // ==========================================
    const handleViewDetails = async (purchaseId, buttonElement) => {

        // Get the exact position of the clicked eye button
        const rect = buttonElement.getBoundingClientRect();

        setDetailsOrigin({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });

        setDetailsLoading(true);
        setShowDetails(true);

        try {

            const response = await axios.get(
                `http://localhost:5000/api/purchases/${purchaseId}/details`
            );

            setSelectedPurchase(response.data.purchase);

        } catch (error) {

            console.error(
                "Failed to fetch purchase details:",
                error
            );

            setShowDetails(false);

        } finally {

            setDetailsLoading(false);

        }
    };
    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="space-y-6">


            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                        Purchases
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage purchase orders from suppliers
                    </p>

                </div>


                <button
                    onClick={() => {

                        setShowForm(!showForm);

                        setError("");
                        setSuccessMessage("");

                    }}
                    className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 sm:w-auto"
                >

                    {showForm
                        ? "Close"
                        : "+ Create Purchase"
                    }

                </button>

            </div>


            {/* ==========================================
                SUCCESS
            ========================================== */}

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


            {/* ==========================================
                ERROR
            ========================================== */}

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


            {/* ==========================================
                CREATE PURCHASE FORM
            ========================================== */}

            {showForm && (

                <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

                    <h2 className="mb-5 text-xl font-semibold text-gray-800">
                        Create Purchase Order
                    </h2>


                    <form
                        onSubmit={handleCreatePurchase}
                        className="space-y-6"
                    >


                        {/* ==================================
                            SUPPLIER + DATES
                        ================================== */}

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">


                            {/* SUPPLIER */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Supplier
                                </label>

                                <select
                                    value={supplierId}
                                    onChange={(e) =>
                                        setSupplierId(
                                            e.target.value
                                        )
                                    }
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                                >

                                    <option value="">
                                        Select Supplier
                                    </option>

                                    {suppliers.map(
                                        (supplier) => (

                                            <option
                                                key={
                                                    supplier.supplier_id
                                                }
                                                value={
                                                    supplier.supplier_id
                                                }
                                            >
                                                {
                                                    supplier.supplier_name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* ORDER DATE */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Order Date
                                </label>

                                <input
                                    type="date"
                                    value={orderDate}
                                    onChange={(e) =>
                                        setOrderDate(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                />

                            </div>


                            {/* EXPECTED DATE */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Expected Date
                                </label>

                                <input
                                    type="date"
                                    value={expectedDate}
                                    onChange={(e) =>
                                        setExpectedDate(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                />

                            </div>

                        </div>


                        {/* ==================================
                            ADD PRODUCT
                        ================================== */}

                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

                            <h3 className="mb-4 font-semibold text-gray-800">
                                Add Products
                            </h3>


                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">


                                {/* PRODUCT */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Product
                                    </label>

                                    <select
                                        value={productId}
                                        onChange={(e) =>
                                            setProductId(
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                                    >

                                        <option value="">
                                            Select Product
                                        </option>

                                        {products.map(
                                            (product) => (

                                                <option
                                                    key={
                                                        product.product_id
                                                    }
                                                    value={
                                                        product.product_id
                                                    }
                                                >
                                                    {
                                                        product.product_name
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                {/* QUANTITY */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Quantity
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Quantity"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                    />

                                </div>


                                {/* UNIT PRICE */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Unit Price
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={unitPrice}
                                        onChange={(e) =>
                                            setUnitPrice(
                                                e.target.value
                                            )
                                        }
                                        placeholder="₹ Price"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                    />

                                </div>


                                {/* ADD BUTTON */}

                                <div className="flex items-end">

                                    <button
                                        type="button"
                                        onClick={
                                            handleAddItem
                                        }
                                        className="w-full rounded-lg bg-gray-800 px-5 py-3 font-medium text-white transition hover:bg-gray-700"
                                    >
                                        Add Item
                                    </button>

                                </div>

                            </div>

                        </div>


                        {/* ==================================
                            ITEMS
                        ================================== */}

                        {items.length > 0 && (

                            <div>

                                <h3 className="mb-3 font-semibold text-gray-800">
                                    Purchase Items
                                </h3>


                                {/* DESKTOP TABLE */}

                                <div className="hidden overflow-x-auto rounded-lg border md:block">

                                    <table className="w-full">

                                        <thead className="bg-gray-800 text-white">

                                            <tr>

                                                <th className="px-4 py-3 text-left">
                                                    Product
                                                </th>

                                                <th className="px-4 py-3 text-left">
                                                    Quantity
                                                </th>

                                                <th className="px-4 py-3 text-left">
                                                    Unit Price
                                                </th>

                                                <th className="px-4 py-3 text-left">
                                                    Total
                                                </th>

                                                <th className="px-4 py-3 text-left">
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {items.map(
                                                (
                                                    item,
                                                    index
                                                ) => (

                                                    <tr
                                                        key={
                                                            index
                                                        }
                                                        className="border-b"
                                                    >

                                                        <td className="px-4 py-3 font-medium">
                                                            {
                                                                item.product_name
                                                            }
                                                        </td>

                                                        <td className="px-4 py-3">
                                                            {
                                                                item.quantity
                                                            }
                                                        </td>

                                                        <td className="px-4 py-3">
                                                            ₹
                                                            {
                                                                item.unit_price
                                                            }
                                                        </td>

                                                        <td className="px-4 py-3">
                                                            ₹
                                                            {
                                                                item.total_price
                                                            }
                                                        </td>

                                                        <td className="px-4 py-3">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveItem(
                                                                        index
                                                                    )
                                                                }
                                                                className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white"
                                                            >
                                                                Remove
                                                            </button>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>


                                {/* MOBILE CARDS */}

                                <div className="space-y-3 md:hidden">

                                    {items.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                key={
                                                    index
                                                }
                                                className="rounded-lg border bg-gray-50 p-4"
                                            >

                                                <div className="flex justify-between">

                                                    <p className="font-semibold">
                                                        {
                                                            item.product_name
                                                        }
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveItem(
                                                                index
                                                            )
                                                        }
                                                        className="text-sm font-medium text-red-600"
                                                    >
                                                        Remove
                                                    </button>

                                                </div>

                                                <div className="mt-3 grid grid-cols-3 gap-3 text-sm">

                                                    <div>

                                                        <p className="text-gray-500">
                                                            Quantity
                                                        </p>

                                                        <p className="font-medium">
                                                            {
                                                                item.quantity
                                                            }
                                                        </p>

                                                    </div>

                                                    <div>

                                                        <p className="text-gray-500">
                                                            Unit Price
                                                        </p>

                                                        <p className="font-medium">
                                                            ₹
                                                            {
                                                                item.unit_price
                                                            }
                                                        </p>

                                                    </div>

                                                    <div>

                                                        <p className="text-gray-500">
                                                            Total
                                                        </p>

                                                        <p className="font-medium">
                                                            ₹
                                                            {
                                                                item.total_price
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>


                                {/* TOTAL */}

                                <div className="mt-4 flex justify-end">

                                    <div className="rounded-lg bg-gray-100 px-5 py-3">

                                        <span className="mr-4 font-medium">
                                            Total:
                                        </span>

                                        <span className="text-xl font-bold">
                                            ₹
                                            {totalAmount.toFixed(
                                                2
                                            )}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        )}


                        {/* ==================================
                            CREATE BUTTON
                        ================================== */}

                        <div className="flex justify-end">

                            <button
                                type="submit"
                                disabled={
                                    saving ||
                                    items.length === 0
                                }
                                className="w-full rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >

                                {saving
                                    ? "Creating..."
                                    : "Create Purchase"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* ==========================================
                PURCHASE LIST
            ========================================== */}

            <div className="rounded-xl bg-white shadow-sm">

                <div className="border-b px-5 py-4 sm:px-6">

                    <h2 className="text-lg font-semibold text-gray-800">
                        Purchase Orders
                    </h2>

                </div>


                {/* DESKTOP */}

                <div className="hidden overflow-x-auto md:block">

                    <table className="w-full">

                        <thead className="bg-gray-800 text-white">

                            <tr>

                                <th className="px-6 py-4 text-left">
                                    ID
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Supplier
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Order Date
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Expected
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Total
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Actions
                                </th>
                            </tr>

                        </thead>


                        <tbody>

                            {purchases.map(
                                (purchase) => (

                                    <tr
                                        key={
                                            purchase.purchase_id
                                        }

                                        className="border-b hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4">
                                            {
                                                purchase.purchase_id
                                            }
                                        </td>

                                        <td className="px-6 py-4 font-medium">
                                            {
                                                purchase.supplier_name
                                            }
                                        </td>

                                        <td className="px-6 py-4">
                                            {
                                                purchase.order_date ||
                                                "-"
                                            }
                                        </td>

                                        <td className="px-6 py-4">
                                            {
                                                purchase.expected_date ||
                                                "-"
                                            }
                                        </td>

                                        <td className="px-6 py-4">
                                            ₹
                                            {
                                                purchase.total_amount
                                            }
                                        </td>

                                        <td className="px-6 py-4">

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${purchase.purchase_status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : purchase.purchase_status === "Received"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {purchase.purchase_status}
                                            </span>

                                        </td>


                                        <td className="px-6 py-4">

                                            {/* VIEW DETAILS */}
                                            <button
                                                type="button"
                                                onClick={(event) =>
                                                    handleViewDetails(
                                                        purchase.purchase_id,
                                                        event.currentTarget
                                                    )
                                                }
                                                title="View purchase details"
                                                className="rounded-lg p-2 text-blue-600 transition-all duration-200 hover:scale-110 hover:bg-blue-50"
                                            >
                                                <Eye size={20} />
                                            </button>
                                            {purchase.purchase_status?.toLowerCase() === "pending" && (

                                                <div className="flex gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleReceivePurchase(
                                                                purchase.purchase_id
                                                            )
                                                        }
                                                        className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                                                    >
                                                        Receive
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCancelPurchase(
                                                                purchase.purchase_id
                                                            )
                                                        }
                                                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                                                    >
                                                        Cancel
                                                    </button>

                                                </div>

                                            )}

                                            {purchase.purchase_status?.toLowerCase() === "received" && (

                                                <span className="text-sm font-medium text-gray-400">
                                                    No Action
                                                </span>

                                            )}

                                            {purchase.purchase_status?.toLowerCase() === "cancelled" && (

                                                <span className="text-sm font-medium text-gray-400">
                                                    No Action
                                                </span>

                                            )}

                                            {purchase.purchase_status?.toLowerCase() === "completed" && (

                                                <span className="text-sm font-medium text-gray-400">
                                                    No Action
                                                </span>

                                            )}

                                        </td>

                                    </tr>

                                )
                            )}


                            {purchases.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="px-6 py-10 text-center text-gray-500"
                                    >
                                        No purchase orders found.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {/* MOBILE */}

                <div className="space-y-4 p-4 md:hidden">

                    {purchases.map(
                        (purchase) => (

                            <div
                                key={
                                    purchase.purchase_id
                                }
                                className="rounded-lg border p-4"
                            >

                                <div className="flex items-center justify-between">

                                    <h3 className="font-semibold text-gray-800">
                                        Purchase #
                                        {
                                            purchase.purchase_id
                                        }
                                    </h3>

                                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                                        {
                                            purchase.purchase_status
                                        }
                                    </span>

                                </div>


                                <div className="mt-4 space-y-2 text-sm">

                                    <p>
                                        <span className="text-gray-500">
                                            Supplier:
                                        </span>{" "}
                                        <span className="font-medium">
                                            {
                                                purchase.supplier_name
                                            }
                                        </span>
                                    </p>

                                    <p>
                                        <span className="text-gray-500">
                                            Order Date:
                                        </span>{" "}
                                        {
                                            purchase.order_date ||
                                            "-"
                                        }
                                    </p>

                                    <p>
                                        <span className="text-gray-500">
                                            Expected:
                                        </span>{" "}
                                        {
                                            purchase.expected_date ||
                                            "-"
                                        }
                                    </p>

                                    <p>
                                        <span className="text-gray-500">
                                            Total:
                                        </span>{" "}
                                        <span className="font-semibold">
                                            ₹
                                            {purchase.total_amount}
                                        </span>
                                    </p>

                                    {/* RECEIVE / CANCEL */}

                                    {purchase.purchase_status === "Pending" && (

                                        <div className="mt-4 flex gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleReceivePurchase(
                                                        purchase.purchase_id
                                                    )
                                                }
                                                className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white"
                                            >
                                                Receive
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleCancelPurchase(
                                                        purchase.purchase_id
                                                    )
                                                }
                                                className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white"
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    )}

                                </div>

                            </div>

                        )
                    )}


                    {purchases.length === 0 && (

                        <p className="py-8 text-center text-gray-500">
                            No purchase orders found.
                        </p>

                    )}

                </div>

            </div>
            {showDetails && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={(event) => {

                        if (event.target === event.currentTarget) {
                            setShowDetails(false);
                        }

                    }}
                >

                    {/* ANIMATED MODAL */}
                    <div
                        className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                        style={{
                            transformOrigin: `${detailsOrigin.x}px ${detailsOrigin.y}px`,
                            animation: "purchaseModalOpen 0.35s ease-out forwards"
                        }}
                    >

                        {/* HEADER */}
                        <div className="flex items-center justify-between border-b px-6 py-4">

                            <div>

                                <h2 className="text-xl font-bold text-gray-800">
                                    Purchase Details
                                </h2>

                                {selectedPurchase && (
                                    <p className="text-sm text-gray-500">
                                        Purchase #{selectedPurchase.purchase_id}
                                    </p>
                                )}

                            </div>


                            <button
                                type="button"
                                onClick={() => setShowDetails(false)}
                                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                            >
                                <X size={22} />
                            </button>

                        </div>


                        {/* BODY */}

                        {detailsLoading ? (

                            <div className="flex min-h-[300px] items-center justify-center">

                                <p className="text-gray-500">
                                    Loading purchase details...
                                </p>

                            </div>

                        ) : selectedPurchase ? (

                            <div className="space-y-6 p-6">

                                {/* PURCHASE INFORMATION */}

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Supplier
                                        </p>

                                        <p className="font-semibold text-gray-800">
                                            {selectedPurchase.supplier_name}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Status
                                        </p>

                                        <span
                                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${selectedPurchase.purchase_status?.toLowerCase() === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : selectedPurchase.purchase_status?.toLowerCase() === "received"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {selectedPurchase.purchase_status}
                                        </span>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Order Date
                                        </p>

                                        <p className="font-semibold text-gray-800">
                                            {selectedPurchase.order_date}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Expected Date
                                        </p>

                                        <p className="font-semibold text-gray-800">
                                            {selectedPurchase.expected_date}
                                        </p>

                                    </div>

                                </div>


                                {/* PRODUCTS */}

                                <div>

                                    <h3 className="mb-3 font-semibold text-gray-800">
                                        Purchased Products
                                    </h3>


                                    <div className="overflow-x-auto rounded-lg border">

                                        <table className="w-full text-sm">

                                            <thead className="bg-gray-800 text-white">

                                                <tr>

                                                    <th className="px-4 py-3 text-left">
                                                        Product
                                                    </th>

                                                    <th className="px-4 py-3 text-center">
                                                        Quantity
                                                    </th>

                                                    <th className="px-4 py-3 text-right">
                                                        Unit Price
                                                    </th>

                                                    <th className="px-4 py-3 text-right">
                                                        Total
                                                    </th>

                                                </tr>

                                            </thead>


                                            <tbody>

                                                {selectedPurchase.items?.map(
                                                    (item) => (

                                                        <tr
                                                            key={
                                                                item.purchase_item_id
                                                            }
                                                            className="border-t"
                                                        >

                                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                                {item.product_name}
                                                            </td>


                                                            <td className="px-4 py-3 text-center">
                                                                {item.quantity}
                                                            </td>


                                                            <td className="px-4 py-3 text-right">
                                                                ₹
                                                                {Number(
                                                                    item.unit_price
                                                                ).toFixed(2)}
                                                            </td>


                                                            <td className="px-4 py-3 text-right font-medium">
                                                                ₹
                                                                {Number(
                                                                    item.total_price
                                                                ).toFixed(2)}
                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                </div>


                                {/* TOTAL */}

                                <div className="flex justify-end border-t pt-4">

                                    <div className="rounded-lg bg-gray-100 px-5 py-3">

                                        <span className="mr-4 font-medium">
                                            Total:
                                        </span>

                                        <span className="text-xl font-bold">
                                            ₹
                                            {Number(
                                                selectedPurchase.total_amount
                                            ).toFixed(2)}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        ) : null}


                        {/* FOOTER */}

                        <div className="flex justify-end border-t px-6 py-4">

                            <button
                                type="button"
                                onClick={() => setShowDetails(false)}
                                className="rounded-lg bg-gray-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-900"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}


            //style for the animation
            {/* Animation */}
            <style>
                {`
                @keyframes purchaseModalOpen {
                    0% {
                        opacity: 0;
                        transform: scale(0.05);
                    }

                    60% {
                        opacity: 1;
                        transform: scale(1.03);
                    }

                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}
            </style>

        </div>

    );
};

export default PurchaseList;