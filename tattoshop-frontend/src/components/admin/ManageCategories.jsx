import React, { useEffect, useState } from "react";
import axios from "axios";
import { FolderOpen } from "lucide-react";
import { getToken } from "../../services/authService";
import "../../styles/ManageCategories.css";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCategories = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/api/categories/with-count", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategories(res.data || []);
    } catch (err) {
      setError("Error al cargar categorías.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }

    try {
      const token = getToken();
      await axios.post(
        "http://localhost:8080/api/categories",
        { name: newCategory.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewCategory("");
      setSuccess("Categoría añadida correctamente.");
      fetchCategories();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Error al añadir la categoría.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;

    try {
      const token = getToken();
      await axios.delete(`http://localhost:8080/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Categoría eliminada correctamente.");
      fetchCategories();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("No se puede eliminar: tiene productos asociados.");
      } else {
        setError("Error al eliminar.");
      }
    }
  };

  return (
    <div className="admin-cat-wrapper">
      <div className="admin-cat-container">
        <h2 className="admin-cat-title">
          <FolderOpen size={28} strokeWidth={2.1} />
          <span>Gestión de Categorías</span>
        </h2>

        {error && <p className="admin-msg error">{error}</p>}
        {success && <p className="admin-msg success">{success}</p>}

        <form onSubmit={handleAdd} className="add-cat-form">
          <input
            type="text"
            placeholder="Nueva categoría"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button type="submit">Añadir</button>
        </form>

        <div className="cat-list">
          {categories.length === 0 ? (
            <p className="no-cats">No hay categorías.</p>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="cat-card">
                <span>
                  {cat.name} - <strong>{cat.productCount}</strong> producto
                  {cat.productCount !== 1 && "s"}
                </span>
                <button
                  className="delete-btn small-btn"
                  onClick={() => handleDelete(cat.id)}
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageCategories;
