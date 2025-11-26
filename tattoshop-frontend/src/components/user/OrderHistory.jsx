import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken, getUserFromToken } from "../../services/authService";
import "../../styles/OrderHistory.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getUserFromToken();
    const currentToken = getToken();

    if (!currentUser || !currentToken) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8080/api/orders/my", {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      })
      .then((res) => setOrders(res.data))
      .catch((err) =>
        console.error("❌ Error cargando historial de pedidos:", err)
      )
      .finally(() => setLoading(false));
  }, [navigate]); // 👈 nada de user/token aquí

  if (loading) {
    return (
      <div className="oh-wrapper">
        <div className="oh-box">
          <p className="oh-loading">⏳ Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="oh-wrapper">
        <div className="oh-box">
          <h2 className="oh-title">Mis pedidos</h2>
          <p className="oh-empty">Todavía no has realizado ningún pedido.</p>
          <button className="oh-btn" onClick={() => navigate("/catalog")}>
            ← Ir al catálogo
          </button>
        </div>
      </div>
    );
  }

  const formatDateTime = (iso) =>
    iso ? new Date(iso).toLocaleString() : "-";

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString() : "-";

  const calcTotal = (order) =>
    (order.items || []).reduce(
      (sum, it) => sum + it.price * it.quantity,
      0
    );

  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED");

  const renderOrderCard = (order) => (
    <div key={order.id} className="oh-order">
      <div className="oh-order-header">
        <div>
          <div className="oh-order-id">Pedido #{order.id}</div>
          <div className="oh-order-date">
            Realizado el {formatDateTime(order.createOrder)}
          </div>
        </div>
        <div className="oh-order-meta">
          <span
            className={
              "oh-status " +
              (order.status === "DELIVERED" ? "delivered" : "pending")
            }
          >
            {order.status === "DELIVERED"
              ? "Entregado"
              : "Pendiente de envío"}
          </span>
          <span className="oh-delivery">
            Entrega estimada: {formatDate(order.estimatedDelivery)}
          </span>
        </div>
      </div>

      <div className="oh-items">
        {(order.items || []).map((it) => (
          <div key={it.id} className="oh-item">
            <img
              src={it.product.imageURL}
              alt={it.product.name}
              className="oh-item-img"
            />
            <div className="oh-item-info">
              <h4>{it.product.name}</h4>
              <p>Cantidad: {it.quantity}</p>
              <p>Precio unidad: {it.price.toFixed(2)} €</p>
            </div>
            <div className="oh-item-total">
              {(it.price * it.quantity).toFixed(2)} €
            </div>
          </div>
        ))}
      </div>

      <div className="oh-order-footer">
        <span className="oh-order-total">
          Total: {calcTotal(order).toFixed(2)} €
        </span>
      </div>
    </div>
  );

  return (
    <div className="oh-wrapper">
      <div className="oh-box">
        <h2 className="oh-title">Mis pedidos</h2>

        <section className="oh-section">
          <h3 className="oh-section-title">Envíos pendientes</h3>
          {pendingOrders.length === 0 ? (
            <p className="oh-empty">No tienes envíos pendientes.</p>
          ) : (
            pendingOrders.map(renderOrderCard)
          )}
        </section>

        <section className="oh-section">
          <h3 className="oh-section-title">Historial de pedidos</h3>
          {deliveredOrders.length === 0 ? (
            <p className="oh-empty">
              Aún no tienes pedidos marcados como entregados.
            </p>
          ) : (
            deliveredOrders.map(renderOrderCard)
          )}
        </section>

        <div className="oh-actions">
          <button className="oh-btn" onClick={() => navigate("/catalog")}>
            ← Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;
