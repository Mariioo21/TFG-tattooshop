import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/ManageUsers.css";
import { getToken } from "../../services/authService";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = getToken();
      if (!token) {
        setError("No tienes permiso para ver esta página.");
        return;
      }

      const res = await axios.get("http://localhost:8080/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ⚙️ Si tu backend devuelve Page<User>, extraemos .content
      setUsers(res.data.content || res.data);
      setError(null);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("❌ No se pudieron cargar los usuarios (403 o error de servidor).");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        const token = getToken();
        await axios.delete(`http://localhost:8080/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter((u) => u.id !== id));
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert("❌ No se pudo eliminar el usuario.");
      }
    }
  };

  if (error) {
    return (
      <div className="admin-container">
        <h2>👥 Gestión de Usuarios</h2>
        <p className="error-msg">{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>👥 Gestión de Usuarios</h2>
      {users.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No hay usuarios registrados.</p>
      ) : (
        <div className="admin-table">
          <table>
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
                    <button onClick={() => handleDelete(u.id)} className="delete-btn">
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
