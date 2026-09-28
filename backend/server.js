require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const stockRoutes = require("./routes/stockRoutes")
const supplierRoutes = require("./routes/supplierRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const app = express();

const customerRoutes = require("./routes/customerRoutes");

const customerOrderRoutes = require("./routes/customerOrderRoutes");

const inventoryRoutes = require("./routes/inventoryRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");

const reportRoutes = require("./routes/reportRoutes");
const authRoutes = require("./routes/authRoutes");

// Middleware
app.use(cors());
app.use(express.json());


// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Inventory Management System API is running"
    });
});


// Product routes
app.use("/api/products", productRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchases", purchaseRoutes);

app.use("/api/customers", customerRoutes);

app.use("/api/customer_orders", customerOrderRoutes);

app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);


// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});