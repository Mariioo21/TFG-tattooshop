import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PackageCheck } from "lucide-react";
import { getToken, getUserFromToken } from "../../services/authService";
import "../../styles/OrderHistory.css";

function PendingOrders() {
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
      .then((res) => {
        const pending = (res.data || []).filter((order) => order.status === "PENDING");
        setOrders(pending);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const formatDateTime = (iso) => (iso ? new Date(iso).toLocaleString() : "-");
  const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "-");
  const calcTotal = (order) =>
    (order.items || []).reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="oh-page">
        <div className="oh-wrapper">
          <div className="oh-box">
            <p className="oh-loading">Cargando envíos pendientes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="oh-page">
        <div className="oh-wrapper">
          <div className="oh-box">
            <h2 className="oh-title">
              <PackageCheck size={28} />
              <span>Envíos pendientes</span>
            </h2>
            <p className="oh-empty">No tienes envíos pendientes.</p>
            <div className="oh-actions">
              <button className="oh-btn" onClick={() => navigate("/orders")}>
                Ver historial de pedidos
              </button>
              <button className="oh-btn" onClick={() => navigate("/catalog")}>
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="oh-page">
      <div className="oh-wrapper">
        <div className="oh-box">
          <h2 className="oh-title">
            <PackageCheck size={28} />
            <span>Envíos pendientes</span>
          </h2>

          {orders.map((order) => (
            <div key={order.id} className="oh-order">
              <div className="oh-order-header">
                <div>
                  <div className="oh-order-id">Pedido #{order.id}</div>
                  <div className="oh-order-date">
                    Realizado el {formatDateTime(order.createOrder)}
                  </div>
                </div>

                <div className="oh-order-meta">
                  <span className="oh-status pending">Pendiente de envío</span>
                  <span className="oh-delivery">
                    Entrega estimada: {formatDate(order.estimatedDelivery)}
                  </span>
                </div>
              </div>

              <div className="oh-items">
                {(order.items || []).map((item) => (
                  <div key={item.id} className="oh-item">
                    <div className="oh-item-media">
                      <img
                        src={item.product.imageURL}
                        alt={item.product.name}
                        className="oh-item-img"
                      />
                    </div>

                    <div className="oh-item-info">
                      <h4>{item.product.name}</h4>
                      <p>Cantidad: {item.quantity}</p>
                      <p>Precio unidad: {item.price.toFixed(2)} €</p>
                    </div>

                    <div className="oh-item-total">
                      {(item.price * item.quantity).toFixed(2)} €
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
          ))}

          <div className="oh-actions">
            <button className="oh-btn" onClick={() => navigate("/orders")}>
              Ver historial de pedidos
            </button>
            <button className="oh-btn" onClick={() => navigate("/catalog")}>
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingOrders;
