import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package } from "lucide-react";
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
    } catch (err) {
      setError("No se pudieron cargar los productos.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Eliminar este producto?")) return;

    try {
      const token = getToken();
      await axios.delete(`http://localhost:8080/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter((p) => p.id !== id));
    } catch {
      alert("Error al eliminar el producto.");
    }
  };

  return (
    <div className="admin-products-wrapper">
      <div className="admin-products-container">
        <h2 className="admin-title">
          <Package size={28} strokeWidth={2.1} />
          <span>Gestion de Productos</span>
        </h2>

        {error && <p className="error-msg">{error}</p>}

        {products.length === 0 ? (
          <p className="no-items">No hay productos disponibles.</p>
        ) : (
          <div className="admin-grid-style">
            {products.map((product) => (
              <div key={product.id} className="pl-card">
                <div className="admin-product-body">
                  <div className="pl-image-wrapper">
                    <img
                      className="pl-image"
                      src={product.imageURL || "https://via.placeholder.com/200"}
                      alt={product.name}
                    />
                  </div>

                  <div className="pl-card-body">
                    <h3 className="pl-name">{product.name}</h3>
                    <p className="pl-desc">{product.description}</p>

                    <div className="pl-meta">
                      <span className="pl-price">{product.price} €</span>
                    </div>
                  </div>
                </div>

                <button onClick={() => handleDelete(product.id)} className="delete-btn">
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageProducts;
