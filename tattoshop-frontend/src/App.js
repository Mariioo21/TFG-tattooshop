import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";

import MyProducts from "./components/seller/MyProducts";
import AddProduct from "./components/seller/AddProduct";
import EditProduct from "./components/seller/EditProduct";
import DeleteProduct from "./components/seller/DeleteProduct";

import ManageUsers from "./components/admin/ManageUsers";
import ManageProducts from "./components/admin/ManageProducts";
import ManageCategories from "./components/admin/ManageCategories";
import AdminDashboard from "./components/admin/AdminDashboard";

import Account from "./components/user/Account";
import Cart from "./components/user/Cart";
import OrderSummary from "./components/user/OrderSummary";
import OrderHistory from "./components/user/OrderHistory";
import PendingOrders from "./components/user/PendingOrders";

import Header from "./components/Header";
import { getUserFromToken } from "./services/authService";

import "./styles/App.css";

function AppContent() {
  const location = useLocation();
  const user = getUserFromToken();
  const defaultAuthenticatedRoute = user?.role === "ADMIN" ? "/admin-dashboard" : "/catalog";

  const hideHeaderRoutes = ["/login", "/register"];
  const shouldShowHeader = user && !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}

      <Routes>
        {/* Raíz → login */}
        <Route
          path="/"
          element={<Navigate to={user ? defaultAuthenticatedRoute : "/login"} />}
        />

        {/* Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Catálogo + detalle */}
        <Route path="/catalog" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Vendedor */}
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product" element={<EditProduct />} />
        <Route path="/delete-product" element={<DeleteProduct />} />

        {/* Admin */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/manage-products" element={<ManageProducts />} />
        <Route path="/manage-categories" element={<ManageCategories />} />

        {/*User */}
        <Route path="/account" element={<Account />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/pendingOrders" element={<PendingOrders />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <h2 style={{ textAlign: "center", marginTop: "50px" }}>
              404 - Página no encontrada
            </h2>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
