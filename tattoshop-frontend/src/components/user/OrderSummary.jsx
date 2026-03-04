import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Package } from "lucide-react";
import "../../styles/OrderSummary.css";

function OrderSummary() {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;
  const summaryMode = location.state?.summaryMode;
  const from = location.state?.from;

  if (!order) {
    return (
      <div className="order-page">
        <div className="order-wrapper">
          <div className="order-box">
            <h2 className="order-title">Resumen no disponible</h2>
            <p className="order-text">
              No se ha encontrado ningún pedido reciente.
            </p>
            <button className="order-btn secondary" onClick={() => navigate("/catalog")}>
              <ArrowLeft size={18} />
              <span>Volver al catálogo</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDateTime = (iso) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleString();
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString();
  };

  const humanStatus =
    order.status === "DELIVERED" ? "Entregado" : "Pendiente de envío";

  const total = order.items
    ? order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  const isHistoryView = summaryMode === "history";

  return (
    <div className="order-page">
      <div className="order-wrapper">
        <div className="order-box">
          <h2 className="order-title">
            <CheckCircle2 size={30} />
            <span>{isHistoryView ? "Resumen del pedido" : "Compra realizada con éxito"}</span>
          </h2>

          <p className="order-text">
            {isHistoryView
              ? "Aquí tienes toda la información de este pedido."
              : "Gracias por tu compra. Aquí tienes el resumen de tu pedido."}
          </p>

          <div className="order-info-grid">
            <div className="order-info-card">
              <span className="order-label">Nº de pedido</span>
              <span className="order-value">#{order.id}</span>
            </div>
            <div className="order-info-card">
              <span className="order-label">Fecha del pedido</span>
              <span className="order-value">{formatDateTime(order.createOrder)}</span>
            </div>
            <div className="order-info-card">
              <span className="order-label">Entrega estimada</span>
              <span className="order-value">{formatDate(order.estimatedDelivery)}</span>
            </div>
            <div className="order-info-card">
              <span className="order-label">Estado</span>
              <span className="order-status">{humanStatus}</span>
            </div>
          </div>

          <div className="order-section-head">
            <Package size={20} />
            <h3 className="order-subtitle">Productos del pedido</h3>
          </div>

          <div className="order-items">
            {order.items &&
              order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="order-item-media">
                    <img
                      src={item.product.imageURL}
                      alt={item.product.name}
                      className="order-img"
                    />
                  </div>

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
            <div className="order-total-box">
              <span className="order-total-label">Total pagado</span>
              <strong>{total.toFixed(2)} €</strong>
            </div>

            <div className="order-buttons">
              <button
                className="order-btn secondary"
                onClick={() => navigate("/catalog")}
              >
                <ArrowLeft size={18} />
                <span>Seguir comprando</span>
              </button>
              <button
                className="order-btn"
                onClick={() => navigate(from || "/orders")}
              >
                {from === "/pendingOrders" ? "Ver envíos pendientes" : "Ver mis pedidos"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
