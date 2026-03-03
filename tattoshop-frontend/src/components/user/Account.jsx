import React from "react";
import { UserRound } from "lucide-react";
import { getUserFromToken } from "../../services/authService";
import "../../styles/Account.css";

function Account() {
  const user = getUserFromToken();

  if (!user) {
    return <p className="acc-error">No hay usuario autenticado.</p>;
  }

  return (
    <div className="acc-page">
      <div className="acc-wrapper">
        <div className="acc-box">
          <h2 className="acc-title">
            <UserRound size={28} />
            <span>Mi cuenta</span>
          </h2>

          <div className="acc-grid">
            <div className="acc-card">
              <span className="acc-label">Nombre de usuario</span>
              <span className="acc-value">{user.username}</span>
            </div>

            <div className="acc-card">
              <span className="acc-label">Rol</span>
              <span className="acc-badge">{user.role}</span>
            </div>

            <div className="acc-card acc-card-full">
              <span className="acc-label">Correo electrónico</span>
              <span className="acc-value">{user.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
