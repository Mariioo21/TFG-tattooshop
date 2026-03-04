import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ClipboardList,
  FolderOpen,
  LayoutDashboard,
  Package,
  PackageCheck,
  Truck,
  UserRound,
  Users,
} from "lucide-react";
import { getToken } from "../../services/authService";
import "../../styles/AdminDashboard.css";

function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError("No tienes permisos para ver el dashboard.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:8080/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMetrics(res.data))
      .catch(() => setError("No se pudieron cargar las métricas."))
      .finally(() => setLoading(false));
  }, []);

  const dashboardCards = metrics
    ? [
        { label: "Usuarios totales", value: metrics.totalUsers, icon: Users },
        { label: "Vendedores", value: metrics.totalSellers, icon: UserRound },
        { label: "Clientes", value: metrics.totalCustomers, icon: Users },
        { label: "Productos", value: metrics.totalProducts, icon: Package },
        { label: "Categorías", value: metrics.totalCategories, icon: FolderOpen },
        { label: "Pedidos", value: metrics.totalOrders, icon: ClipboardList },
        { label: "Pendientes", value: metrics.pendingOrders, icon: Truck },
        { label: "Entregados", value: metrics.deliveredOrders, icon: PackageCheck },
      ]
    : [];

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-dashboard-container">
        <h2 className="admin-dashboard-title">
          <LayoutDashboard size={28} strokeWidth={2.1} />
          <span>Dashboard de Administración</span>
        </h2>

        {loading && <p className="admin-dashboard-info">Cargando métricas...</p>}
        {error && <p className="admin-dashboard-info admin-dashboard-error">{error}</p>}

        {!loading && !error && metrics && (
          <>
            <section className="admin-dashboard-grid">
              {dashboardCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article key={card.label} className="admin-dashboard-card">
                    <div className="admin-dashboard-card-head">
                      <span>{card.label}</span>
                      <Icon size={18} strokeWidth={2.1} />
                    </div>
                    <strong>{card.value}</strong>
                  </article>
                );
              })}
            </section>

            <section className="admin-dashboard-panels">
              <article className="admin-dashboard-panel">
                <h3>Resumen general</h3>
                <p>
                  Actualmente la plataforma cuenta con <strong>{metrics.totalProducts}</strong>{" "}
                  productos repartidos en <strong>{metrics.totalCategories}</strong> categorías.
                </p>
                <p>
                  Hay <strong>{metrics.totalUsers}</strong> usuarios registrados, de los cuales{" "}
                  <strong>{metrics.totalSellers}</strong> son vendedores y{" "}
                  <strong>{metrics.totalCustomers}</strong> son clientes.
                </p>
              </article>

              <article className="admin-dashboard-panel">
                <h3>Estado de pedidos</h3>
                <p>
                  Se han registrado <strong>{metrics.totalOrders}</strong> pedidos en total.
                </p>
                <p>
                  <strong>{metrics.pendingOrders}</strong> siguen pendientes de entrega y{" "}
                  <strong>{metrics.deliveredOrders}</strong> ya constan como entregados.
                </p>
              </article>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
