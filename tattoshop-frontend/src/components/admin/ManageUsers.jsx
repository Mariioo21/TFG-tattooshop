import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import ConfirmModal from "../common/ConfirmModal";
import { useToast } from "../common/ToastProvider";
import "../../styles/ManageUsers.css";
import { getToken } from "../../services/authService";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const toast = useToast();

  const ITEMS_PER_PAGE = 10;

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

  const filteredUsers = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return users;

    return users.filter(
      (user) =>
        user.username?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query)
    );
  }, [users, searchText]);

  const paginatedUsers = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const token = getToken();
      await axios.delete(`http://localhost:8080/api/users/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const nextUsers = users.filter((u) => u.id !== userToDelete.id);
      setUsers(nextUsers);
      toast.success("El usuario se ha eliminado correctamente.", "Usuario eliminado");
      setUserToDelete(null);

      const nextTotalPages = Math.max(1, Math.ceil(nextUsers.length / ITEMS_PER_PAGE));
      setCurrentPage((page) => Math.min(page, nextTotalPages));
    } catch {
      toast.error("No se pudo eliminar el usuario.");
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

        <div className="admin-search-row">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Buscar por usuario, correo o rol"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {users.length === 0 ? (
          <p style={{ textAlign: "center", color: "#bbb" }}>No hay usuarios registrados.</p>
        ) : filteredUsers.length === 0 ? (
          <p style={{ textAlign: "center", color: "#bbb" }}>
            No hay usuarios que coincidan con la búsqueda.
          </p>
        ) : (
          <>
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
                  {paginatedUsers.map((u) => (
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

            {totalPages > 1 && (
              <div className="admin-pagination">
                <button
                  type="button"
                  className="admin-page-arrow"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={safePage === 1}
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="admin-page-list">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`admin-page-button ${safePage === page ? "is-active" : ""}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="admin-page-arrow"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={safePage === totalPages}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
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
