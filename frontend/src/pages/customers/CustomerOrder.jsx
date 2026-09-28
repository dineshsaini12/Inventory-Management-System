import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Plus, X } from "lucide-react";

const CustomerOrder = () => {

    // ==========================================
    // STATES
    // ==========================================

    const [orders, setOrders] = useState([]);

    const [products, setProducts] = useState([]);

    const [showForm, setShowForm] = useState(false);

    const [showDetails, setShowDetails] = useState(false);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ==========================================
    // CUSTOMER DETAILS
    // ==========================================

    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("");


    // ==========================================
    // ORDER ITEMS
    // ==========================================

    const [items, setItems] = useState([
        {
            product_id: "",
            quantity: 1,
            selling_price: ""
        }
    ]);


    // ==========================================
    // FETCH ORDERS
    // ==========================================

    const fetchOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/customer_orders"
            );

            setOrders(response.data.orders || []);

        } catch (error) {

            console.error("Fetch orders error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch customer orders"
            );

        } finally {

            setLoading(false);

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

            console.error("Fetch products error:", error);

        }

    };


    // ==========================================
    // PAGE LOAD
    // ==========================================

    useEffect(() => {

        fetchOrders();
        fetchProducts();

    }, []);


    // ==========================================
    // ADD ITEM
    // ==========================================

    const addItem = () => {

        setItems([
            ...items,
            {
                product_id: "",
                quantity: 1,
                selling_price: ""
            }
        ]);

    };


    // ==========================================
    // REMOVE ITEM
    // ==========================================

    const removeItem = (index) => {

        if (items.length === 1) {
            return;
        }

        setItems(
            items.filter((_, itemIndex) => itemIndex !== index)
        );

    };


    // ==========================================
    // UPDATE ITEM
    // ==========================================

    const updateItem = (index, field, value) => {

        const updatedItems = [...items];

        updatedItems[index][field] = value;

        // Automatically fill product price
        if (field === "product_id") {

            const product = products.find(
                (p) =>
                    Number(p.product_id) === Number(value)
            );

            if (product) {

                updatedItems[index].selling_price =
                    product.price;

            }

        }

        setItems(updatedItems);

    };


    // ==========================================
    // CREATE ORDER
    // ==========================================

    const handleCreateOrder = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (!customerName.trim()) {

            setError("Customer name is required");
            return;

        }


        if (!paymentMethod) {

            setError("Payment method is required");
            return;

        }


        const invalidItem = items.some(
            (item) =>
                !item.product_id ||
                Number(item.quantity) <= 0 ||
                item.selling_price === ""
        );


        if (invalidItem) {

            setError(
                "Please enter valid product, quantity and price"
            );

            return;

        }


        try {

            const response = await axios.post(
                "http://localhost:5000/api/customer_orders",
                {
                    customer_name: customerName,
                    phone_no: phone, 
                    email: email,
                    address: address,
                    items: items.map((item) => ({
                        product_id: Number(item.product_id),
                        quantity: Number(item.quantity),
                        selling_price:
                            Number(item.selling_price)
                    })),
                    payment_method: paymentMethod
                }
            );


            setSuccess(
                response.data.message ||
                "Customer order created successfully"
            );


            // Reset form

            setCustomerName("");
            setPhone("");
            setEmail("");
            setAddress("");
            setPaymentMethod("");

            setItems([
                {
                    product_id: "",
                    quantity: 1,
                    selling_price: ""
                }
            ]);


            setShowForm(false);

            // Refresh orders

            fetchOrders();

        } catch (error) {

            console.error(
                "Create customer order error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create customer order"
            );

        }

    };


    // ==========================================
    // VIEW ORDER DETAILS
    // ==========================================

    const viewOrderDetails = async (orderId) => {

        try {

            setError("");

            const response = await axios.get(
                `http://localhost:5000/api/customer_orders/${orderId}`
            );

            setSelectedOrder(
                response.data.order
            );

            setShowDetails(true);

        } catch (error) {

            console.error(
                "Order details error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to fetch order details"
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
                    Loading customer orders...
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
                        Customer Orders
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Create and manage customer orders
                    </p>

                </div>


                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setError("");
                        setSuccess("");
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-gray-800 px-5 py-3 font-semibold text-white hover:bg-gray-700"
                >

                    {showForm ? (
                        <>
                            <X size={18} />
                            Close
                        </>
                    ) : (
                        <>
                            <Plus size={18} />
                            Create Order
                        </>
                    )}

                </button>

            </div>


            {/* SUCCESS */}

            {success && (

                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">

                    <p className="font-semibold">
                        Success
                    </p>

                    <p className="mt-1 text-sm">
                        {success}
                    </p>

                </div>

            )}


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


            {/* ==========================================
                CREATE ORDER FORM
            ========================================== */}

            {showForm && (

                <form
                    onSubmit={handleCreateOrder}
                    className="space-y-6 rounded-xl bg-white p-6 shadow-sm"
                >

                    <h2 className="text-xl font-bold text-gray-800">
                        Customer Details
                    </h2>


                    {/* CUSTOMER DETAILS */}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <div>

                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Customer Name *
                            </label>

                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) =>
                                    setCustomerName(e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-800"
                                placeholder="Enter customer name"
                            />

                        </div>


                        <div>

                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Phone
                            </label>

                            <input
                                type="text"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-800"
                                placeholder="Enter phone number"
                            />

                        </div>


                        <div>

                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-800"
                                placeholder="Enter email"
                            />

                        </div>


                        <div>

                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Address
                            </label>

                            <input
                                type="text"
                                value={address}
                                onChange={(e) =>
                                    setAddress(e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-800"
                                placeholder="Enter address"
                            />

                        </div>

                    </div>


                    {/* ==========================================
                        ITEMS
                    ========================================== */}

                    <div className="border-t pt-6">

                        <div className="mb-4 flex items-center justify-between">

                            <h2 className="text-xl font-bold text-gray-800">
                                Order Items
                            </h2>

                            <button
                                type="button"
                                onClick={addItem}
                                className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                            >
                                + Add Item
                            </button>

                        </div>


                        <div className="space-y-4">

                            {items.map((item, index) => (

                                <div
                                    key={index}
                                    className="rounded-lg border border-gray-200 p-4"
                                >

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

                                        {/* PRODUCT */}

                                        <div>

                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Product
                                            </label>

                                            <select
                                                value={item.product_id}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "product_id",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-3 py-3"
                                            >

                                                <option value="">
                                                    Select Product
                                                </option>

                                                {products.map((product) => (

                                                    <option
                                                        key={product.product_id}
                                                        value={product.product_id}
                                                    >
                                                        {product.product_name}
                                                    </option>

                                                ))}

                                            </select>

                                        </div>


                                        {/* QUANTITY */}

                                        <div>

                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Quantity
                                            </label>

                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-3 py-3"
                                            />

                                        </div>


                                        {/* PRICE */}

                                        <div>

                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Selling Price
                                            </label>

                                            <input
                                                type="number"
                                                min="0"
                                                value={item.selling_price}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "selling_price",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-3 py-3"
                                            />

                                        </div>


                                        {/* REMOVE */}

                                        <div className="flex items-end">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeItem(index)
                                                }
                                                className="w-full rounded-lg bg-red-100 px-4 py-3 font-semibold text-red-600 hover:bg-red-200"
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>


                    {/* ==========================================
                        PAYMENT
                    ========================================== */}

                    <div className="border-t pt-6">

                        <h2 className="mb-4 text-xl font-bold text-gray-800">
                            Payment
                        </h2>

                        <select
                            value={paymentMethod}
                            onChange={(e) =>
                                setPaymentMethod(e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 md:w-1/2"
                        >

                            <option value="">
                                Select Payment Method
                            </option>

                            <option value="Cash">
                                Cash
                            </option>

                            <option value="UPI">
                                UPI
                            </option>

                            <option value="Card">
                                Card
                            </option>

                        </select>

                    </div>


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-gray-800 px-5 py-3 font-semibold text-white hover:bg-gray-700"
                    >
                        Create Customer Order
                    </button>

                </form>

            )}


            {/* ==========================================
                ORDERS TABLE
            ========================================== */}

            <div className="overflow-x-auto rounded-xl bg-white shadow-sm">

                <table className="w-full">

                    <thead className="bg-gray-800 text-white">

                        <tr>

                            <th className="px-6 py-4 text-left">
                                Order ID
                            </th>

                            <th className="px-6 py-4 text-left">
                                Customer
                            </th>

                            <th className="px-6 py-4 text-left">
                                Date
                            </th>

                            <th className="px-6 py-4 text-left">
                                Total Amount
                            </th>

                            <th className="px-6 py-4 text-left">
                                Payment
                            </th>

                            <th className="px-6 py-4 text-center">
                                Details
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {orders.map((order) => (

                            <tr
                                key={order.order_id}
                                className="border-b hover:bg-gray-50"
                            >

                                <td className="px-6 py-4 font-semibold">
                                    #{order.order_id}
                                </td>

                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {order.customer_name}
                                </td>

                                <td className="px-6 py-4">
                                    {order.order_date}
                                </td>

                                <td className="px-6 py-4 font-semibold">
                                    ₹{order.total_amount}
                                </td>

                                <td className="px-6 py-4">

                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                        {order.payment_status}
                                    </span>

                                </td>

                                <td className="px-6 py-4 text-center">

                                    <button
                                        onClick={() =>
                                            viewOrderDetails(
                                                order.order_id
                                            )
                                        }
                                        className="inline-flex rounded-lg bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
                                    >

                                        <Eye size={18} />

                                    </button>

                                </td>

                            </tr>

                        ))}


                        {orders.length === 0 && (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="px-6 py-10 text-center text-gray-500"
                                >
                                    No customer orders found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>


            {/* ==========================================
                ORDER DETAILS MODAL
            ========================================== */}

            {showDetails && selectedOrder && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6">

                        <div className="mb-6 flex items-center justify-between">

                            <h2 className="text-xl font-bold text-gray-800">
                                Order #{selectedOrder.order_id}
                            </h2>

                            <button
                                onClick={() => {
                                    setShowDetails(false);
                                    setSelectedOrder(null);
                                }}
                                className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
                            >
                                <X size={20} />
                            </button>

                        </div>


                        {/* CUSTOMER */}

                        <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-2">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Customer
                                </p>

                                <p className="font-semibold">
                                    {selectedOrder.customer_name}
                                </p>

                            </div>


                            <div>

                                <p className="text-sm text-gray-500">
                                    Phone
                                </p>

                                <p className="font-semibold">
                                    {selectedOrder.phone_no || "-"}
                                </p>

                            </div>


                            <div>

                                <p className="text-sm text-gray-500">
                                    Email
                                </p>

                                <p className="font-semibold">
                                    {selectedOrder.email || "-"}
                                </p>

                            </div>


                            <div>

                                <p className="text-sm text-gray-500">
                                    Address
                                </p>

                                <p className="font-semibold">
                                    {selectedOrder.address || "-"}
                                </p>

                            </div>

                        </div>


                        {/* ITEMS */}

                        <div className="mt-6">

                            <h3 className="mb-3 text-lg font-bold">
                                Order Items
                            </h3>

                            <div className="overflow-x-auto">

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
                                                Price
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {selectedOrder.items?.map(
                                            (item) => (

                                                <tr
                                                    key={
                                                        item.order_item_id
                                                    }
                                                    className="border-b"
                                                >

                                                    <td className="px-4 py-3">
                                                        {item.product_name}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {item.quantity}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        ₹{item.selling_price}
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        {/* PAYMENT */}

                        <div className="mt-6 flex flex-col gap-3 rounded-lg bg-gray-50 p-4 sm:flex-row sm:justify-between">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Payment Method
                                </p>

                                <p className="font-semibold">
                                    {selectedOrder.payment_method || "-"}
                                </p>

                            </div>


                            <div>

                                <p className="text-sm text-gray-500">
                                    Total Amount
                                </p>

                                <p className="text-xl font-bold">
                                    ₹{selectedOrder.total_amount}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};

export default CustomerOrder;