import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout, getUserFromToken } from "../services/authService";
import "../styles/Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(getUserFromToken());
  const [searchText, setSearchText] = useState("");
  const menuRef = useRef(null);
  const catRef = useRef(null);
  const navigate = useNavigate();

  // Mantener usuario actualizado si cambia en localStorage
  useEffect(() => {
    const handleStorageChange = () => setUser(getUserFromToken());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Cargar categorías para el desplegable
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
  }, []);

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (catRef.current && !catRef.current.contains(e.target)) {
        setCatsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    if (q.length === 0) {
      navigate("/catalog");
    } else {
      navigate(`/catalog?search=${encodeURIComponent(q)}`);
    }
  };

  const handleCategorySelect = (name) => {
    setCatsOpen(false);
    navigate(`/catalog?category=${encodeURIComponent(name)}`);
  };

  if (!user) return null;

  return (
    <header className="header">
      <div className="header-content header-full">
        {/* Logo */}
        <h1
          className="header-title"
          onClick={() => navigate("/catalog")}
          title="Ir al catálogo"
        >
          TattooShop
        </h1>

        {/* Categorías */}
        <div className="header-categories" ref={catRef}>
          <button
            className="cat-toggle"
            onClick={() => setCatsOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={catsOpen}
          >
            Categorías ▾
          </button>
          {catsOpen && (
            <div className="cat-dropdown" role="listbox">
              {categories.length === 0 && (
                <div className="cat-empty">Sin categorías</div>
              )}
              {categories.map((c) => (
                <button
                  key={c.id}
                  className="cat-item"
                  onClick={() => handleCategorySelect(c.name)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buscador centrado */}
        <div className="header-search">
          <input
            type="text"
            placeholder="Buscar productos…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch} title="Buscar">
            🔍
          </button>
        </div>

        {/* Usuario / menú */}
        <div className="header-user" ref={menuRef}>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {user.username} ⬇️
          </button>

          {menuOpen && (
            <div className="menu-dropdown">
              {/* USER */}
              {user.role === "USER" && (
                <>
                  <button onClick={() => goTo("/catalog")} className="menu-item">
                    🛍️ Ver Catálogo
                  </button>
                  <button onClick={() => goTo("/cart")} className="menu-item">
                    🛒 Mi Carrito
                  </button>
                  <button onClick={() => goTo("/pending-orders")} className="menu-item">
                    ⏳ Envíos Pendientes
                  </button>
                  <button onClick={() => goTo("/order-history")} className="menu-item">
                    📦 Historial de Pedidos
                  </button>
                  <button onClick={() => goTo("/account")} className="menu-item">
                    👤 Mi Cuenta
                  </button>
                </>
              )}

              {/* SELLER */}
              {user.role === "SELLER" && (
                <>
                  <button onClick={() => goTo("/catalog")} className="menu-item">
                    🛍️ Ver catálogo
                  </button>
                  <button onClick={() => goTo("/my-products")} className="menu-item">
                    📦 Mis productos
                  </button>
                  <button onClick={() => goTo("/add-product")} className="menu-item">
                    ➕ Añadir producto
                  </button>
                  <button onClick={() => goTo("/edit-product")} className="menu-item">
                    ✏️ Editar producto
                  </button>
                  <button onClick={() => goTo("/delete-product")} className="menu-item">
                    🗑️ Eliminar producto
                  </button>
                </>
              )}

              {/* ADMIN */}
              {user.role === "ADMIN" && (
                <>
                  <button onClick={() => goTo("/catalog")} className="menu-item">
                    🛍️ Ver catálogo
                  </button>
                  <button onClick={() => goTo("/manage-users")} className="menu-item">
                    👥 Gestionar usuarios
                  </button>
                  <button onClick={() => goTo("/manage-products")} className="menu-item">
                    🛒 Gestionar productos
                  </button>
                  <button onClick={() => goTo("/manage-categories")} className="menu-item">
                    🗂️ Gestionar categorías
                  </button>
                </>
              )}

              <hr className="menu-divider" />
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
