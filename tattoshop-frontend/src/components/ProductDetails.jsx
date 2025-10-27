import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getToken, getUserFromToken } from "../services/authService";
import "../styles/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");

  const user = getUserFromToken();
  const isUser = user?.role === "USER";
  const token = getToken();

  const api = axios.create({
    baseURL: "http://localhost:8080/api/cart",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const changeQty = (v) => setQty(Math.max(1, Math.min(99, qty + v)));

  const inputQty = (e) => {
    const clean = e.target.value.replace(/\D/g, "");
    setQty(clean === "" ? 1 : Math.min(99, Number(clean)));
  };

  const goBack = () => navigate(`/catalog${location.search}`);

  const addToCart = () => {
    if (!isUser) {
      setMessage("⚠️ Solo los usuarios pueden comprar.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    api
      .post(`/add/${product.id}?qty=${qty}`)
      .then(() => {
        window.dispatchEvent(new Event("cartUpdated")); // ✅ ACTUALIZA HEADER EN TIEMPO REAL
        setMessage(`✅ ${qty} unidad(es) añadidas al carrito`);
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(() => {
        setMessage("❌ Error al añadir al carrito");
        setTimeout(() => setMessage(""), 3000);
      });
  };

  if (loading) return <p className="pd-loading">⏳ Cargando…</p>;
  if (!product) return <p className="pd-notfound">❌ Producto no encontrado</p>;

  return (
    <div className="pd-container">
      <button className="pl-back" onClick={goBack}>← Volver</button>

      <div className="pd-card">
        <img className="pd-image" src={product.imageURL} alt={product.name} />

        <div className="pd-info">
          <h2 className="pd-name">{product.name}</h2>
          <p className="pd-desc">{product.description}</p>
          <p className="pd-price">💸 <strong>{product.price} €</strong></p>

          {product.category && (
            <p className="pd-category">🏷️ Categoría: {product.category.name}</p>
          )}
          {product.seller && (
            <p className="pd-seller">🛒 Vendedor: {product.seller.username}</p>
          )}

          <div className="pd-qty">
            <button className="pd-qty-btn" onClick={() => changeQty(-1)}>−</button>
            <input
              className="pd-qty-input"
              type="text"
              value={qty}
              onChange={inputQty}
            />
            <button className="pd-qty-btn" onClick={() => changeQty(1)}>+</button>
          </div>

          <button className="pd-add-btn" disabled={!isUser} onClick={addToCart}>
            🛒 Añadir al carrito
          </button>

          {message && <p className="pd-toast">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
