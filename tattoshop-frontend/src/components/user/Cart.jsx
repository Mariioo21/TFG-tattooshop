import React, { useEffect, useState } from "react";
import "../../styles/Cart.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import { useToast } from "../common/ToastProvider";
import { getToken, getUserFromToken } from "../../services/authService";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

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
        window.dispatchEvent(new Event("cartUpdated"));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return <p className="cart-loading">Cargando carrito...</p>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-wrapper">
          <div className="cart-box cart-box-empty">
            <h2 className="cart-title">
              <ShoppingCart size={28} />
              <span>Mi carrito</span>
            </h2>
            <p className="cart-empty">No hay productos en el carrito.</p>
            <button className="cart-back" onClick={() => navigate("/catalog")}>
              <ArrowLeft size={18} />
              <span>Volver al catálogo</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const updateQuantity = (itemId, qty) => {
    if (qty < 1) return;
    api.put(`/update/${itemId}?qty=${qty}`).then(() => fetchCart());
  };

  const removeItem = (itemId) => {
    api.delete(`/remove/${itemId}`).then(() => {
      fetchCart();
      toast.success("El producto se ha eliminado del carrito.", "Producto eliminado");
    });
  };

  const clearCart = () => {
    api.delete("/clear").then(() => {
      fetchCart();
      toast.info("Se han eliminado todos los productos del carrito.", "Carrito vaciado");
    });
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    axios
      .post(
        "http://localhost:8080/api/orders/checkout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const order = res.data;
        setCart(null);
        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/order-summary", { state: { order } });
      })
      .catch((err) => {
        const msg =
          err.response?.data ||
          "No se pudo completar la compra. Inténtalo de nuevo.";
        toast.error(msg);
      });
  };

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <div className="cart-wrapper">
        <div className="cart-box">
          <h2 className="cart-title">
            <ShoppingCart size={28} />
            <span>Mi carrito</span>
          </h2>

          <div className="cart-list">
            {cart.items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-media">
                  <img
                    className="cart-img"
                    src={item.product.imageURL}
                    alt={item.product.name}
                  />
                </div>

                <div className="cart-info">
                  <h3>{item.product.name}</h3>
                  <p className="cart-price">{item.product.price} €</p>
                  {item.product.category?.name && (
                    <p className="cart-category">{item.product.category.name}</p>
                  )}
                </div>

                <div className="cart-actions">
                  <div className="cart-qty">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="qty">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={16} />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="cart-total-box">
              <span className="cart-total-label">Total</span>
              <strong>{total.toFixed(2)} €</strong>
            </div>

            <div className="cart-buttons">
              <button className="clear-btn" onClick={clearCart}>
                Vaciar carrito
              </button>
              <button className="checkout-btn" onClick={handleCheckout}>
                Finalizar compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
