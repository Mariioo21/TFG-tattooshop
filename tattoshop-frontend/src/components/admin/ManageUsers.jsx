import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users } from "lucide-react";
import ConfirmModal from "../common/ConfirmModal";
import "../../styles/ManageUsers.css";
import { getToken } from "../../services/authService";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = getToken();
      if (!token) {
        setError("No tienes permiso para ver esta página.");
        return;
      }

      const res = await axios.get("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.content || res.data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("No se pudieron cargar los usuarios.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const token = getToken();
      await axios.delete(`http://localhost:8080/api/users/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    } catch {
      alert("Error al eliminar usuario");
    }
  };

  return (
    <div className="admin-users-wrapper">
      <div className="admin-users-container">
        <h2 className="admin-title">
          <Users size={28} strokeWidth={2.1} />
          <span>Gestion de Usuarios</span>
        </h2>

        {error && <p className="error-msg">{error}</p>}

        {users.length === 0 ? (
          <p style={{ textAlign: "center", color: "#bbb" }}>No hay usuarios registrados.</p>
        ) : (
          <div className="admin-table-box">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <button onClick={() => setUserToDelete(u)} className="delete-btn">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(userToDelete)}
        title="Eliminar usuario"
        message={
          userToDelete
            ? `¿Seguro que quieres eliminar al usuario ${userToDelete.username}?`
            : ""
        }
        confirmText="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  );
}

export default ManageUsers;
