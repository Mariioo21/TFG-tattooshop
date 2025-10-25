import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserFromToken } from "../services/authService";
import "../styles/ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState("");

  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const searchQuery = new URLSearchParams(location.search).get("search") || "";
  const categoryQuery = new URLSearchParams(location.search).get("category") || "";

  const showFilters = Boolean(searchQuery || categoryQuery || priceMin || priceMax);

  useEffect(() => {
    const user = getUserFromToken();
    if (user && !sessionStorage.getItem("welcomeShown")) {
      setWelcomeMessage(`Bienvenido de nuevo, ${user.username} 😎`);
      sessionStorage.setItem("welcomeShown", "true");
      setTimeout(() => setWelcomeMessage(""), 4000);
    }

    axios
      .get("http://localhost:8080/api/products")
      .then((response) => {
        const data = response.data.content || response.data;
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    if (categoryQuery) {
      result = result.filter((p) => p.category?.name === categoryQuery);
    }

    if (priceMin) result = result.filter((p) => p.price >= Number(priceMin));
    if (priceMax) result = result.filter((p) => p.price <= Number(priceMax));

    setFiltered(result);
  }, [products, searchQuery, categoryQuery, priceMin, priceMax]);

  const resetFilters = () => {
    setPriceMin("");
    setPriceMax("");
    navigate("/catalog");
  };

  if (loading) return <p className="pl-loading">⏳ Cargando productos...</p>;

  return (
    <div className="pl-wrapper">

      {/* ✅ NUEVO: Contenedor negro como en SELLER */}
      <div className="pl-box">

        {showFilters && (
          <aside className="pl-filters">
            <h3>Filtros</h3>

            <label>Precio mínimo:</label>
            <input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              placeholder="0"
            />

            <label>Precio máximo:</label>
            <input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder="999"
            />
          </aside>
        )}

        <main className="pl-main">

          {showFilters && (
            <button className="pl-back" onClick={resetFilters}>
              ← Volver
            </button>
          )}

          {welcomeMessage && <div className="pl-welcome">{welcomeMessage}</div>}

          <h1 className="pl-title">🛍️ Productos disponibles</h1>

          {filtered.length === 0 ? (
            <p className="pl-empty">No se encontraron productos.</p>
          ) : (
            <div className="pl-grid">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="pl-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="pl-image-wrapper">
                    <img
                      className="pl-image"
                      src={product.imageURL || "https://via.placeholder.com/200"}
                      alt={product.name}
                    />
                  </div>

                  <h3 className="pl-name">{product.name}</h3>
                  <p className="pl-desc">{product.description}</p>

                  <div className="pl-meta">
                    <span className="pl-price">{product.price} €</span>
                    {product.category && (
                      <span className="pl-category">{product.category.name}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div> {/* ✅ FIN de pl-box */}

    </div>
  );
}

export default ProductList;
