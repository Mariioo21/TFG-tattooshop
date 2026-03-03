import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FolderOpen,
  LayoutGrid,
  Package,
  PackageCheck,
  Pencil,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  User,
  UserRound,
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

  const sellerNavItems = [
    { key: "catalog", label: "Catalogo", path: "/catalog", icon: LayoutGrid },
    { key: "mine", label: "Mis productos", path: "/my-products", icon: Package },
    { key: "add", label: "Añadir", path: "/add-product", icon: Plus },
    { key: "edit", label: "Editar", path: "/edit-product", icon: Pencil },
    { key: "delete", label: "Eliminar", path: "/delete-product", icon: Trash2 },
  ];

  const userNavItems = [
    { key: "catalog", label: "Catalogo", path: "/catalog", icon: LayoutGrid },
    { key: "cart", label: "Mi carrito", path: "/cart", icon: ShoppingCart },
    { key: "pending", label: "Envios pendientes", path: "/pendingOrders", icon: PackageCheck },
    { key: "orders", label: "Historial", path: "/orders", icon: Package },
    { key: "account", label: "Mi cuenta", path: "/account", icon: UserRound },
  ];

  const isAdminArea =
    user?.role === "ADMIN" &&
    ["/manage-users", "/manage-products", "/manage-categories"].includes(
      location.pathname
    );

  const isSellerArea =
    user?.role === "SELLER" &&
    ["/my-products", "/add-product", "/edit-product", "/delete-product"].includes(
      location.pathname
    );

  const isUserArea =
    user?.role === "USER" &&
    ["/cart", "/pendingOrders", "/orders", "/account"].includes(
      location.pathname
    );

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
        const totalQty = (res.data.items || []).reduce(
          (sum, item) => sum + item.quantity,
          0
        );
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

  const isPanelArea = isAdminArea || isSellerArea || isUserArea;

  return (
    <header className="header">
      <div
        className={`header-content header-full ${
          isPanelArea ? "header-admin-layout" : ""
        }`}
      >
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
        ) : isSellerArea ? (
          <>
            <nav className="header-admin-nav" aria-label="Navegacion de vendedor">
              {sellerNavItems.map((item) => {
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
        ) : isUserArea ? (
          <>
            <nav className="header-admin-nav" aria-label="Navegacion de usuario">
              {userNavItems.map((item) => {
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
              <div
                className="header-cart"
                onClick={() => navigate("/cart")}
                title="Carrito"
              >
                <ShoppingCart size={18} strokeWidth={2.2} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
            )}

            <div className="header-user" ref={menuRef}>
              <button
                type="button"
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <User size={18} strokeWidth={2.2} />
              </button>

              {menuOpen && (
                <div className="menu-dropdown">
                  {user.role === "USER" && (
                    <>
                      <button onClick={() => goTo("/catalog")} className="menu-item">
                        Ver catalogo
                      </button>
                      <button onClick={() => goTo("/cart")} className="menu-item">
                        Mi carrito
                      </button>
                      <button
                        onClick={() => goTo("/pendingOrders")}
                        className="menu-item"
                      >
                        Envios pendientes
                      </button>
                      <button onClick={() => goTo("/orders")} className="menu-item">
                        Historial de pedidos
                      </button>
                      <button onClick={() => goTo("/account")} className="menu-item">
                        Mi cuenta
                      </button>
                    </>
                  )}

                  {user.role === "SELLER" && (
                    <>
                      <button onClick={() => goTo("/my-products")} className="menu-item">
                        Mis productos
                      </button>
                      <button onClick={() => goTo("/add-product")} className="menu-item">
                        Añadir producto
                      </button>
                      <button onClick={() => goTo("/edit-product")} className="menu-item">
                        Editar producto
                      </button>
                      <button onClick={() => goTo("/delete-product")} className="menu-item">
                        Eliminar producto
                      </button>
                      <button onClick={() => goTo("/catalog")} className="menu-item">
                        Ver catalogo
                      </button>
                    </>
                  )}

                  {user.role === "ADMIN" && (
                    <>
                      <button onClick={() => goTo("/manage-users")} className="menu-item">
                        Gestionar usuarios
                      </button>
                      <button onClick={() => goTo("/manage-products")} className="menu-item">
                        Gestionar productos
                      </button>
                      <button
                        onClick={() => goTo("/manage-categories")}
                        className="menu-item"
                      >
                        Gestionar categorias
                      </button>
                      <button onClick={() => goTo("/catalog")} className="menu-item">
                        Ver catalogo
                      </button>
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
