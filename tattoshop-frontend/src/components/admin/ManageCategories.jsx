import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../services/authService";
import "../../styles/ManageCategories.css";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Cargar todas las categorías al iniciar
  const fetchCategories = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/api/categories/with-count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
      setError("❌ Error al cargar las categorías.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Añadir nueva categoría
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setError("⚠️ El nombre de la categoría no puede estar vacío.");
      return;
    }

    try {
      const token = getToken();
      await axios.post(
        "http://localhost:8080/api/categories",
        { name: newCategory.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewCategory("");
      setSuccess("✅ Categoría añadida correctamente.");
      fetchCategories();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error al añadir categoría:", err);
      if (err.response && err.response.status === 403) {
        setError("❌ No tienes permisos para añadir categorías.");
      } else {
        setError("❌ Error al añadir la categoría.");
      }
    }
  };

  // ✅ Eliminar categoría
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;

    try {
      const token = getToken();
      await axios.delete(`http://localhost:8080/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("✅ Categoría eliminada correctamente.");
      fetchCategories();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error al eliminar categoría:", err);

      if (err.response && err.response.status === 409) {
        setError("⚠️ No se puede eliminar una categoría que tiene productos asociados.");
      } else if (err.response && err.response.status === 403) {
        setError("❌ No tienes permisos para eliminar categorías.");
      } else {
        setError("❌ Error desconocido al eliminar la categoría.");
      }
    }
  };

  return (
    <div className="admin-container">
      <h2>🗂️ Gestión de Categorías</h2>

      {error && <p className="admin-error">{error}</p>}
      {success && <p className="admin-success">{success}</p>}

      {/* Formulario para añadir */}
      <form onSubmit={handleAdd} className="add-category-form">
        <input
          type="text"
          placeholder="Nombre de la nueva categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="submit">➕ Añadir</button>
      </form>

      {/* Lista de categorías */}
      <div className="category-list">
        {categories.length === 0 ? (
          <p>No hay categorías disponibles.</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="category-card">
              <span className="category-name">
                {cat.name} — <strong>{cat.productCount}</strong> producto
                {cat.productCount !== 1 && "s"}
              </span>
              <button
                onClick={() => handleDelete(cat.id)}
                className="delete-btn small-icon-btn"
                title="Eliminar categoría"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ManageCategories;
