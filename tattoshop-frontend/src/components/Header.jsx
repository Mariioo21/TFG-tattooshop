import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUserFromToken } from "../services/authService";
import "../styles/Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(getUserFromToken());
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => setUser(getUserFromToken());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
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

  if (!user) return null;

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title" onClick={() => navigate("/catalog")} style={{ cursor: "pointer" }}>
          TattooShop
        </h1>

        <div className="header-user" ref={menuRef}>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {user.username} ⬇️
          </button>

          {menuOpen && (
            <div className="menu-dropdown">
              
              {/* ✅ MENÚ PARA USUARIO NORMAL */}
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

              {/* ✅ MENÚ SELLER */}
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

              {/* ✅ MENÚ ADMIN */}
              {user.role === "ADMIN" && (
                <>
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
