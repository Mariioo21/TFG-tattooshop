import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  ClipboardList,
  FolderOpen,
  LayoutDashboard,
  Package,
  PackageCheck,
  Truck,
  UserRound,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../services/authService";
import "../../styles/AdminDashboard.css";

function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const quickLinks = [
    {
      label: "Gestionar usuarios",
      description: "Revisa cuentas registradas y elimina accesos si hace falta.",
      path: "/manage-users",
      icon: Users,
    },
    {
      label: "Gestionar productos",
      description: "Controla el catálogo y accede rápido a cada ficha.",
      path: "/manage-products",
      icon: Package,
    },
    {
      label: "Gestionar categorías",
      description: "Añade o limpia categorías para mantener ordenada la tienda.",
      path: "/manage-categories",
      icon: FolderOpen,
    },
    {
      label: "Ver catálogo",
      description: "Comprueba cómo se ve la tienda desde la parte pública.",
      path: "/catalog",
      icon: ClipboardList,
    },
  ];

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

            <section className="admin-dashboard-actions">
              <div className="admin-dashboard-section-head">
                <h3>Accesos rápidos</h3>
                <p>Atajos directos a las gestiones más importantes del panel.</p>
              </div>

              <div className="admin-dashboard-links">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.path}
                      type="button"
                      className="admin-dashboard-link"
                      onClick={() => navigate(link.path)}
                    >
                      <div className="admin-dashboard-link-icon">
                        <Icon size={20} strokeWidth={2.1} />
                      </div>

                      <div className="admin-dashboard-link-copy">
                        <strong>{link.label}</strong>
                        <span>{link.description}</span>
                      </div>

                      <ArrowRight size={18} strokeWidth={2.1} />
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="admin-dashboard-actions">
              <div className="admin-dashboard-section-head">
                <h3>Vista rápida</h3>
                <p>Estado general de la plataforma en este momento.</p>
              </div>

              <div className="admin-dashboard-mini-grid">
                <article className="admin-dashboard-mini-card">
                  <span>Pendientes de entrega</span>
                  <strong>{metrics.pendingOrders}</strong>
                  <p>Pedidos que aún no han pasado al historial.</p>
                </article>

                <article className="admin-dashboard-mini-card">
                  <span>Relación catálogo</span>
                  <strong>
                    {metrics.totalProducts} / {metrics.totalCategories}
                  </strong>
                  <p>Productos y categorías activas actualmente.</p>
                </article>

                <article className="admin-dashboard-mini-card">
                  <span>Base de usuarios</span>
                  <strong>
                    {metrics.totalSellers} + {metrics.totalCustomers}
                  </strong>
                  <p>Vendedores y clientes que forman la plataforma.</p>
                </article>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
