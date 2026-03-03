import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package } from "lucide-react";
import { getToken } from "../../services/authService";
import "../../styles/ProductList.css";
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

  if (loading) return <p className="pl-loading">Cargando productos...</p>;

  return (
    <div className="my-products-wrapper">
      <div className="my-products-container">
        <h2 className="my-title">
          <Package size={28} strokeWidth={2.1} />
          <span>Mis productos</span>
        </h2>

        {products.length === 0 ? (
          <p className="pl-empty">No tienes productos publicados aun.</p>
        ) : (
          <div className="my-grid-style">
            {products.map((product) => (
              <div key={product.id} className="pl-card pl-card-static">
                <div className="my-product-body">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProducts;
