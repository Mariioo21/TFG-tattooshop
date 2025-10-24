import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserFromToken } from "../services/authService";
import "../styles/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ▼ Unidades
  const [qty, setQty] = useState(1);

  // ▼ Mensaje feedback
  const [message, setMessage] = useState("");

  // ▼ Usuario (para controlar permisos de “añadir al carrito”)
  const user = getUserFromToken();
  const isUser = user?.role === "USER";

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar producto:", err);
        setLoading(false);
      });
  }, [id]);

  const changeQty = (val) => {
    setQty((prev) => {
      const next = Math.max(1, Math.min(99, Number(prev) + val));
      return next;
    });
  };

  const onQtyInput = (e) => {
    const v = e.target.value.replace(/\D/g, "");
    if (v === "") {
      setQty(1);
    } else {
      const n = Math.max(1, Math.min(99, Number(v)));
      setQty(n);
    }
  };

  const handleAddToCart = () => {
    if (!isUser) {
      setMessage("❌ Solo los usuarios registrados (USER) pueden añadir al carrito.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (!product) return;

    const item = {
      productId: product.id,
      name: product.name,
      price: product.price,
      imageURL: product.imageURL || "",
      quantity: qty,
    };

    const raw = localStorage.getItem("cart");
    const current = raw ? JSON.parse(raw) : [];

    const idx = current.findIndex((it) => it.productId === item.productId);
    if (idx >= 0) {
      current[idx].quantity = Math.min(99, current[idx].quantity + item.quantity);
    } else {
      current.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(current));
    setMessage(`✅ Añadido al carrito: ${item.quantity} ud(s).`);
    setTimeout(() => setMessage(""), 3000);
  };

  if (loading)
    return <p className="pd-loading">⏳ Cargando producto...</p>;

  if (!product)
    return <p className="pd-notfound">❌ Producto no encontrado</p>;

  return (
    <div className="pd-container">
      {/* 🔙 Botón volver */}
      <button className="pd-back" onClick={() => navigate("/catalog")}>
        ← Volver
      </button>

      <div className="pd-card">
        <img
          className="pd-image"
          src={product.imageURL || "https://via.placeholder.com/350"}
          alt={product.name}
        />

        <div className="pd-info">
          <h2 className="pd-name">{product.name}</h2>

          <p className="pd-desc">{product.description}</p>

          <p className="pd-price">
            💸 <strong>{product.price} €</strong>
          </p>

          {product.category && (
            <p className="pd-category">🏷️ Categoría: {product.category.name}</p>
          )}

          {product.seller && (
            <p className="pd-seller">🛒 Vendido por: {product.seller.username}</p>
          )}

          {/* ▼ Control de unidades */}
          <div className="pd-qty">
            <button
              type="button"
              className="pd-qty-btn"
              onClick={() => changeQty(-1)}
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <input
              className="pd-qty-input"
              type="text"
              inputMode="numeric"
              value={qty}
              onChange={onQtyInput}
              aria-label="Cantidad"
            />
            <button
              type="button"
              className="pd-qty-btn"
              onClick={() => changeQty(1)}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          {/* Botón añadir carrito */}
          <button
            className={`pd-add-btn ${!isUser ? "disabled" : ""}`}
            onClick={handleAddToCart}
            disabled={!isUser}
            title={!isUser ? "Inicia sesión como USER para añadir al carrito" : "Añadir al carrito"}
          >
            🛒 Añadir al carrito
          </button>

          {message && <div className="pd-toast">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
