import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../services/authService";
import "../../styles/MyProducts.css";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    axios
      .get("http://localhost:8080/api/products/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading">Cargando tus productos...</p>;

  return (
    <div className="my-products-container">
      <h2>📦 Mis productos</h2>

      {products.length === 0 ? (
        <p>No tienes productos publicados aún.</p>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <img
                src={p.imageURL || "https://via.placeholder.com/200"}
                alt={p.name}
              />
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <strong>{p.price} €</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProducts;
