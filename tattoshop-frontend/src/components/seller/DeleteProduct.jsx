import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../services/authService";
import "../../styles/DeleteProduct.css";

function DeleteProduct() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");
  const token = getToken();

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:8080/api/products/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error al cargar productos:", err));
  }, [token]);

  const handleDelete = async () => {
    if (!selectedId) {
      setMessage("⚠️ Selecciona un producto para eliminar");
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/products/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Producto eliminado correctamente");
      setProducts(products.filter((p) => p.id !== parseInt(selectedId)));
      setSelectedId("");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setMessage("❌ Error al eliminar producto");
    }
  };

  return (
    <div className="delete-product-container">
      <h2>🗑️ Eliminar producto</h2>

      <select
        className="product-select"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="">-- Selecciona un producto --</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <button onClick={handleDelete} className="delete-btn">
        Eliminar producto
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default DeleteProduct;
