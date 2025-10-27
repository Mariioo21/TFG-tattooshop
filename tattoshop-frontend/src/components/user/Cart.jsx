import React, { useEffect, useState } from "react";
import "../../styles/Cart.css";

import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(stored);
  }, []);

  const updateQuantity = (id, delta) => {
    const updated = items.map(item =>
      item.productId === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = items.filter(item => item.productId !== id);
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setItems([]);
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="cart-wrapper">
        <div className="cart-box">
          <h2 className="cart-title">🛒 Mi carrito</h2>
          <p className="cart-empty">No hay productos en el carrito.</p>
          <button className="cart-back" onClick={() => navigate("/catalog")}>
            ← Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-wrapper">
      <div className="cart-box">
        <h2 className="cart-title">🛒 Mi carrito</h2>

        {items.map(item => (
          <div key={item.productId} className="cart-item">
            <img className="cart-img" src={item.imageURL} alt={item.name} />

            <div className="cart-info">
              <h3>{item.name}</h3>
              <p className="cart-price">{item.price} €</p>
            </div>

            <div className="cart-actions">
              <button onClick={() => updateQuantity(item.productId, -1)}>-</button>
              <span className="qty">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, 1)}>+</button>
            </div>

            <button className="remove-btn" onClick={() => removeItem(item.productId)}>Eliminar</button>
          </div>
        ))}

        <div className="cart-footer">
          <h3>Total: {total.toFixed(2)} €</h3>
          <div className="cart-buttons">
            <button className="clear-btn" onClick={clearCart}>Vaciar carrito</button>
            <button className="checkout-btn" onClick={() => alert("Compra aún no implementada 😅")}>
              Finalizar compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
