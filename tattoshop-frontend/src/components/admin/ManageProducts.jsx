import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import ConfirmModal from "../common/ConfirmModal";
import "../../styles/ManageProducts.css";
import { getToken } from "../../services/authService";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const token = getToken();
      await axios.delete(`http://localhost:8080/api/products/${productToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setProductToDelete(null);
    } catch {
      alert("Error al eliminar el producto.");
    }
  };

  const openProductPreview = (id) => {
    navigate(`/product/${id}`, {
      state: {
        from: `${location.pathname}${location.search}`,
        readonlyPreview: true,
      },
    });
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
                <button
                  type="button"
                  className="admin-product-preview"
                  onClick={() => openProductPreview(product.id)}
                >
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
                </button>

                <button onClick={() => setProductToDelete(product)} className="delete-btn">
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(productToDelete)}
        title="Eliminar producto"
        message={
          productToDelete
            ? `¿Seguro que quieres eliminar ${productToDelete.name}?`
            : ""
        }
        confirmText="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}

export default ManageProducts;
