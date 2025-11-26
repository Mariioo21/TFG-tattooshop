import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/OrderSummary.css";

function OrderSummary() {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;

  // Si no hay pedido en el state (por ejemplo, recarga directa)
  if (!order) {
    return (
      <div className="order-wrapper">
        <div className="order-box">
          <h2 className="order-title">Resumen no disponible</h2>
          <p className="order-text">
            No se ha encontrado ningún pedido reciente.
          </p>
          <button
            className="order-btn"
            onClick={() => navigate("/catalog")}
          >
            ← Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  const formatDateTime = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleString();
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString();
  };

  const humanStatus =
    order.status === "DELIVERED" ? "Entregado" : "Pendiente de envío";

  const total = order.items
    ? order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    : 0;

  return (
    <div className="order-wrapper">
      <div className="order-box">
        <h2 className="order-title">✅ Compra realizada con éxito</h2>

        <p className="order-text">
          ¡Gracias por tu compra! Aquí tienes el resumen de tu pedido.
        </p>

        <div className="order-info">
          <div className="order-row">
            <span className="order-label">Nº de pedido:</span>
            <span className="order-value">#{order.id}</span>
          </div>
          <div className="order-row">
            <span className="order-label">Fecha del pedido:</span>
            <span className="order-value">
              {formatDateTime(order.createOrder)}
            </span>
          </div>
          <div className="order-row">
            <span className="order-label">Entrega estimada:</span>
            <span className="order-value">
              {formatDate(order.estimatedDelivery)}
            </span>
          </div>
          <div className="order-row">
            <span className="order-label">Estado:</span>
            <span className="order-value status">{humanStatus}</span>
          </div>
        </div>

        <h3 className="order-subtitle">Productos del pedido</h3>

        <div className="order-items">
          {order.items &&
            order.items.map((item) => (
              <div key={item.id} className="order-item">
                <img
                  src={item.product.imageURL}
                  alt={item.product.name}
                  className="order-img"
                />
                <div className="order-item-info">
                  <h4>{item.product.name}</h4>
                  <p>Cantidad: {item.quantity}</p>
                  <p>Precio unidad: {item.price.toFixed(2)} €</p>
                </div>
                <div className="order-item-total">
                  {(item.price * item.quantity).toFixed(2)} €
                </div>
              </div>
            ))}
        </div>

        <div className="order-footer">
          <h3 className="order-total">
            Total pagado: {total.toFixed(2)} €
          </h3>

          <div className="order-buttons">
            <button
              className="order-btn secondary"
              onClick={() => navigate("/catalog")}
            >
              ← Seguir comprando
            </button>
            <button
              className="order-btn"
              onClick={() => navigate("/cart")}
            >
              Ver carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
