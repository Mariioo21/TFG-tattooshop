import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../services/authService";
import "../styles/ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Saludo con el username correcto
    const user = getUserFromToken();
    if (user?.username) {
      setWelcomeMessage(`Bienvenido de nuevo, ${user.username}`);
      const t = setTimeout(() => setWelcomeMessage(""), 4000);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")
      .then((response) => {
        // Soporta Page<Product> (response.data.content) y listas simples
        const data = response?.data;
        setProducts(Array.isArray(data) ? data : data?.content ?? []);
      })
      .catch((error) => {
        console.error("Error al obtener productos:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="pl-loading">Cargando productos...</p>;

  return (
    <div className="pl-wrapper">
      {welcomeMessage && (
        <div className="pl-welcome">{welcomeMessage}</div>
      )}

      <h1 className="pl-title">🛍️ Lista de Productos</h1>

      {products.length === 0 ? (
        <p className="pl-empty">No hay productos disponibles.</p>
      ) : (
        <div className="pl-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="pl-card"
              onClick={() => navigate(`/product/${product.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate(`/product/${product.id}`);
              }}
            >
              <img
                className="pl-image"
                src={product.imageURL || "https://via.placeholder.com/200"}
                alt={product.name}
              />
              <h3 className="pl-name">{product.name}</h3>
              <p className="pl-desc">{product.description}</p>
              <div className="pl-meta">
                <strong className="pl-price">{product.price} €</strong>
                {product.category?.name && (
                  <span className="pl-category">Categoría: {product.category.name}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
