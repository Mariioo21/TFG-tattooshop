import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { logout, getUserFromToken, getToken } from "../services/authService";
import "../styles/Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(getUserFromToken());
  const [searchText, setSearchText] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const menuRef = useRef(null);
  const catRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = getToken();

  useEffect(() => {
    const handleStorageChange = () => setUser(getUserFromToken());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/api/categories")
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
  }, []);

  const fetchCartCount = () => {
    if (!user || user.role !== "USER") return;
    axios.get("http://localhost:8080/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const totalQty = (res.data.items || []).reduce((sum, i) => sum + i.quantity, 0);
      setCartCount(totalQty);
    })
    .catch(() => setCartCount(0));
  };

  useEffect(() => {
    fetchCartCount();
  }, [user, token, location.pathname]);

  useEffect(() => {
    window.addEventListener("cartUpdated", fetchCartCount);
    return () => window.removeEventListener("cartUpdated", fetchCartCount);
  }, [user, token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleSearch = () => {
    const q = searchText.trim();
    if (q.length === 0) navigate("/catalog");
    else navigate(`/catalog?search=${encodeURIComponent(q)}`);
  };

  const handleCategorySelect = (name) => {
    setCatsOpen(false);
    navigate(`/catalog?category=${encodeURIComponent(name)}`);
  };

  if (!user) return null;

  return (
    <header className="header">
      <div className="header-content header-full">

        {/* -- LOGO -- */}
        <h1 className="header-title" onClick={() => navigate("/catalog")}>
          TattooShop
        </h1>

        {/* -- CATEGORIAS -- */}
        <div className="header-categories" ref={catRef}>
          <button className="cat-toggle" onClick={() => setCatsOpen(!catsOpen)}>
            Categorías ▾
          </button>
          {catsOpen && (
            <div className="cat-dropdown">
              {categories.map(c => (
                <button
                  key={c.id}
                  className="cat-item"
                  onClick={() => handleCategorySelect(c.name)}>
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* -- BUSCADOR -- */}
        <div className="header-search">
          <input
            type="text"
            placeholder="Buscar productos…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>🔍</button>
        </div>

        {/* -- CARRITO (solo USER) -- */}
        {user.role === "USER" && (
          <div className="header-cart" onClick={() => navigate("/cart")} title="Carrito">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
        )}

        {/* -- USUARIO -- */}
        <div className="header-user" ref={menuRef}>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {user.username} ⬇️
          </button>

          {menuOpen && (
            <div className="menu-dropdown">
              {user.role === "USER" && (
                <>
                  <button onClick={() => goTo("/catalog")} className="menu-item">🛍️ Ver Catálogo</button>
                  <button onClick={() => goTo("/cart")} className="menu-item">🛒 Mi Carrito</button>
                  <button onClick={() => goTo("/pending-orders")} className="menu-item">⏳ Envíos Pendientes</button>
                  <button onClick={() => goTo("/order-history")} className="menu-item">📦 Historial de Pedidos</button>
                  <button onClick={() => goTo("/account")} className="menu-item">👤 Mi Cuenta</button>
                </>
              )}

              {user.role === "SELLER" && (
                <>
                  <button onClick={() => goTo("/catalog")} className="menu-item">🛍️ Ver Catálogo</button>
                  <button onClick={() => goTo("/my-products")} className="menu-item">📦 Mis productos</button>
                  <button onClick={() => goTo("/add-product")} className="menu-item">➕ Añadir producto</button>
                  <button onClick={() => goTo("/edit-product")} className="menu-item">✏️ Editar producto</button>
                  <button onClick={() => goTo("/delete-product")} className="menu-item">🗑️ Eliminar producto</button>
                </>
              )}

              {user.role === "ADMIN" && (
                <>
                  <button onClick={() => goTo("/catalog")} className="menu-item">🛍️ Ver catálogo</button>
                  <button onClick={() => goTo("/manage-users")} className="menu-item">👥 Gestionar usuarios</button>
                  <button onClick={() => goTo("/manage-products")} className="menu-item">🛒 Gestionar productos</button>
                  <button onClick={() => goTo("/manage-categories")} className="menu-item">🗂️ Gestionar categorías</button>
                </>
              )}

              <hr className="menu-divider" />

              {/* ✅ BOTÓN CERRAR SESIÓN RESTAURADO */}
              <button onClick={handleLogout} className="menu-item logout">
                🚪 Cerrar sesión
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;
