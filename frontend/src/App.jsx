import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/products/ProductList";

import AddProduct from "./pages/products/AddProduct";

import StockList from "./pages/stock/StockList";

import SupplierList from "./pages/suppliers/SupplierList"
import PurchaseList from "./pages/purchases/PurchaseList";


import CustomerOrder from "./pages/customers/CustomerOrder";
import InventoryList from "./pages/inventory/InventoryList";

import Report from "./pages/reports/Reports";

import Login from "./pages/loginsignup/Login";
import Signup from "./pages/loginsignup/Signup";



const App = () => {
  return (
    <BrowserRouter>

      <Routes>
        {/* Login signup page route */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* Products */}
        <Route
          path="/products"
          element={
            <Layout>
              <ProductList />
            </Layout>
          }
        />

        <Route
          path="/products/add"
          element={
            <Layout>
              <AddProduct />
            </Layout>
          }
        />

        {/* stock list is here */}
        <Route
          path="/stock"
          element={
            <Layout>
              <StockList />
            </Layout>
          }
        />
        <Route
          path="/reports"
          element={
            <Layout>
              <Report />
            </Layout>
          }
        />
        <Route
          path="/inventory"
          element={
            <Layout>
              <InventoryList />
            </Layout>
          }
        />

        {/* customers list is here */}
        {/* customers list */}
        <Route
          path="/customers"
          element={
            <Layout>
              <CustomerOrder />
            </Layout>
          }
        />
        {/* supplier part  */}
        <Route
          path="/suppliers"
          element={
            <Layout>
              <SupplierList />
            </Layout>
          }
        />

        {/* purchase Part */}
        <Route
          path="/purchases"
          element={
            <Layout>
              <PurchaseList />
            </Layout>
          }
        />


        {/* Default page */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
};

export default App;