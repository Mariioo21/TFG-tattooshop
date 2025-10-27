import React, { useEffect, useState } from "react";
import "../../styles/Cart.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken, getUserFromToken } from "../../services/authService";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = getToken();
  const user = getUserFromToken();

  const api = axios.create({
    baseURL: "http://localhost:8080/api/cart",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchCart = () => {
    if (!user) {
      setLoading(false);
      return;
    }
    api
      .get("")
      .then((res) => {
        setCart(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading)
    return <p className="cart-loading">⏳ Cargando carrito...</p>;

  if (!cart || !cart.items || cart.items.length === 0) {
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

  const updateQuantity = (itemId, qty) => {
    if (qty < 1) return;
    api
      .put(`/update/${itemId}?qty=${qty}`)
      .then(() => fetchCart());
  };

  const removeItem = (itemId) => {
    api
      .delete(`/remove/${itemId}`)
      .then(() => fetchCart());
  };

  const clearCart = () => {
    api
      .delete(`/clear`)
      .then(() => fetchCart());
  };

  const total = cart.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <div className="cart-wrapper">
      <div className="cart-box">
        <h2 className="cart-title">🛒 Mi carrito</h2>

        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            <img
              className="cart-img"
              src={item.product.imageURL}
              alt={item.product.name}
            />

            <div className="cart-info">
              <h3>{item.product.name}</h3>
              <p className="cart-price">{item.product.price} €</p>
            </div>

            <div className="cart-actions">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                -
              </button>
              <span className="qty">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                +
              </button>
            </div>

            <button className="remove-btn" onClick={() => removeItem(item.id)}>
              Eliminar
            </button>
          </div>
        ))}

        <div className="cart-footer">
          <h3>Total: {total.toFixed(2)} €</h3>
          <div className="cart-buttons">
            <button className="clear-btn" onClick={clearCart}>
              Vaciar carrito
            </button>
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
