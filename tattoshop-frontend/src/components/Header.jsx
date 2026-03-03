import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FolderOpen,
  LayoutGrid,
  Package,
  Search,
  ShoppingCart,
  User,
  Users,
} from "lucide-react";
import { logout, getUserFromToken, getToken } from "../services/authService";
import "../styles/Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(getUserFromToken());
  const [searchText, setSearchText] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = getToken();

  const adminNavItems = [
    { key: "catalog", label: "Catalogo", path: "/catalog", icon: LayoutGrid },
    { key: "users", label: "Usuarios", path: "/manage-users", icon: Users },
    { key: "products", label: "Productos", path: "/manage-products", icon: Package },
    { key: "categories", label: "Categorias", path: "/manage-categories", icon: FolderOpen },
  ];

  const isAdminArea =
    user?.role === "ADMIN" &&
    ["/manage-users", "/manage-products", "/manage-categories"].includes(location.pathname);

  useEffect(() => {
    const handleStorageChange = () => setUser(getUserFromToken());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchCartCount = () => {
    if (!user || user.role !== "USER") return;
    axios
      .get("http://localhost:8080/api/cart", {
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

  if (!user) return null;

  return (
    <header className="header">
      <div className={`header-content header-full ${isAdminArea ? "header-admin-layout" : ""}`}>
        <button
          type="button"
          className="header-brand"
          onClick={() => navigate("/catalog")}
          aria-label="Ir al catalogo"
        >
          <img className="header-brand-icon" src="/logo.png" alt="TattooShop" />
          <img className="header-brand-text" src="/letras.png" alt="TattooShop" />
        </button>

        {isAdminArea ? (
          <>
            <nav className="header-admin-nav" aria-label="Navegacion de administracion">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.key}
                    type="button"
                    className={`header-admin-link ${isActive ? "is-active" : ""}`}
                    onClick={() => navigate(item.path)}
                  >
                    <Icon size={18} strokeWidth={2.1} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <button
              type="button"
              className="header-admin-logout"
              onClick={handleLogout}
            >
              Cerrar sesion
            </button>
          </>
        ) : (
          <>
            <div className="header-search">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="search-btn" onClick={handleSearch}>
                <Search size={18} strokeWidth={2.2} />
              </button>
            </div>

            {user.role === "USER" && (
              <div className="header-cart" onClick={() => navigate("/cart")} title="Carrito">
                <ShoppingCart size={18} strokeWidth={2.2} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
            )}

            <div className="header-user" ref={menuRef}>
              <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                <User size={18} strokeWidth={2.2} />
              </button>

              {menuOpen && (
                <div className="menu-dropdown">
                  {user.role === "USER" && (
                    <>
                      <button onClick={() => goTo("/catalog")} className="menu-item">Ver catalogo</button>
                      <button onClick={() => goTo("/cart")} className="menu-item">Mi carrito</button>
                      <button onClick={() => goTo("/pendingOrders")} className="menu-item">Envios pendientes</button>
                      <button onClick={() => goTo("/orders")} className="menu-item">Historial de pedidos</button>
                      <button onClick={() => goTo("/account")} className="menu-item">Mi cuenta</button>
                    </>
                  )}

                  {user.role === "SELLER" && (
                    <>
                      <button onClick={() => goTo("/catalog")} className="menu-item">Ver catalogo</button>
                      <button onClick={() => goTo("/my-products")} className="menu-item">Mis productos</button>
                      <button onClick={() => goTo("/add-product")} className="menu-item">Anadir producto</button>
                      <button onClick={() => goTo("/edit-product")} className="menu-item">Editar producto</button>
                      <button onClick={() => goTo("/delete-product")} className="menu-item">Eliminar producto</button>
                    </>
                  )}

                  {user.role === "ADMIN" && (
                    <>
                      <button onClick={() => goTo("/manage-users")} className="menu-item">Gestionar usuarios</button>
                      <button onClick={() => goTo("/manage-products")} className="menu-item">Gestionar productos</button>
                      <button onClick={() => goTo("/manage-categories")} className="menu-item">Gestionar categorias</button>
                      <button onClick={() => goTo("/catalog")} className="menu-item">Ver catalogo</button>
                    </>
                  )}

                  <hr className="menu-divider" />

                  <button onClick={handleLogout} className="menu-item logout">
                    Cerrar sesion
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
