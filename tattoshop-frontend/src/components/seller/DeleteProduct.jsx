import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { getToken } from "../../services/authService";
import "../../styles/DeleteProduct.css";

function DeleteProduct() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState("");

  const token = getToken();

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:8080/api/products/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data || []))
      .catch(() => {});
  }, [token]);

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    setMessage("");

    const product = products.find((item) => item.id === parseInt(id, 10));
    setSelectedProduct(product || null);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.trim().toLowerCase())
  );

  const handleDelete = async () => {
    if (!selectedId) {
      setMessage("Selecciona un producto para eliminar.");
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/products/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Producto eliminado correctamente.");
      setProducts((prev) => prev.filter((product) => product.id !== parseInt(selectedId, 10)));
      setSelectedId("");
      setSelectedProduct(null);
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Error al eliminar el producto.");
    }
  };

  return (
    <div className="delete-page">
      <div className="delete-container">
        <h2 className="delete-title">
          <Trash2 size={28} />
          <span>Eliminar producto</span>
        </h2>

        <input
          type="text"
          className="delete-search"
          placeholder="Buscar producto por nombre"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="delete-select"
          value={selectedId}
          onChange={handleSelect}
        >
          <option value="">Selecciona un producto</option>
          {filteredProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>

        {selectedProduct && (
          <div className="delete-preview-card">
            <div className="delete-preview-media">
              <img
                src={
                  selectedProduct.imageURL ||
                  "https://via.placeholder.com/480x320?text=Vista+previa"
                }
                alt={selectedProduct.name}
                className="delete-preview-img"
              />
            </div>

            <div className="delete-preview-info">
              <p className="delete-preview-tag">
                {selectedProduct.category?.name || "Categoría"}
              </p>
              <h3>{selectedProduct.name}</h3>
              <p className="delete-preview-desc">
                {selectedProduct.description || "Sin descripción."}
              </p>
              <p className="delete-preview-price">{selectedProduct.price} €</p>
            </div>
          </div>
        )}

        <button onClick={handleDelete} className="delete-btn">
          Eliminar producto
        </button>

        {message && <p className="delete-message">{message}</p>}
      </div>
    </div>
  );
}

export default DeleteProduct;
