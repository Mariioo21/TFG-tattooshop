import React from "react";
import { getUserFromToken } from "../../services/authService";
import "../../styles/Account.css";

function Account() {
  const user = getUserFromToken();

  if (!user) {
    return <p className="acc-error">No hay usuario autenticado</p>;
  }

  return (
    <div className="acc-wrapper">
      <div className="acc-box">
        <h2 className="acc-title">👤 Mi Cuenta</h2>

        <div className="acc-row">
          <span className="acc-label">Nombre:</span>
          <span className="acc-value">{user.username}</span>
        </div>

        <div className="acc-row">
          <span className="acc-label">Correo:</span>
          <span className="acc-value">{user.email}</span>
        </div>

        <div className="acc-row">
          <span className="acc-label">Rol:</span>
          <span className="acc-value">{user.role}</span>
        </div>

      </div>
    </div>
  );
}

export default Account;
