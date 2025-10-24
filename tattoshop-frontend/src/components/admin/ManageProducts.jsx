import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/ManageProducts.css";
import { getToken } from "../../services/authService";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const token = getToken();
      if (!token) {
        setError("No tienes permisos para ver los productos.");
        return;
      }

      const res = await axios.get("http://localhost:8080/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(res.data.content || res.data);
      setError(null);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError("❌ No se pudieron cargar los productos (403 o error de servidor).");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      const token = getToken();
      await axios.delete(`http://localhost:8080/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      alert("❌ No tienes permisos para eliminar este producto (403).");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (error) {
    return (
      <div className="admin-container">
        <h2>🛒 Gestión de Productos</h2>
        <p className="error-msg">{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>🛒 Gestión de Productos</h2>
      {products.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No hay productos disponibles.</p>
      ) : (
        <div className="admin-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <img
                src={p.imageURL || "https://via.placeholder.com/200"}
                alt={p.name}
              />
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <p>
                <strong>{p.price} €</strong>
              </p>
              <p className="category">
                Categoría: {p.category?.name || "Sin categoría"}
              </p>
              <button onClick={() => handleDelete(p.id)} className="delete-btn">
                🗑️ Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageProducts;
