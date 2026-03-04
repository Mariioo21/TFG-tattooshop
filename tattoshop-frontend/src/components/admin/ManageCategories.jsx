import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, FolderOpen } from "lucide-react";
import ConfirmModal from "../common/ConfirmModal";
import { useToast } from "../common/ToastProvider";
import { getToken } from "../../services/authService";
import "../../styles/ManageCategories.css";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const toast = useToast();

  const ITEMS_PER_PAGE = 10;

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

  const filteredCategories = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter((category) => category.name?.toLowerCase().includes(query));
  }, [categories, searchText]);

  const paginatedCategories = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filteredCategories.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredCategories.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCategories, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

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
      setError("");
      setSuccess("Categoría añadida correctamente.");
      toast.success("La categoría se ha añadido correctamente.", "Categoría añadida");
      fetchCategories();
      setCurrentPage(1);
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Error al añadir la categoría.");
      toast.error("No se pudo añadir la categoría.");
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const token = getToken();
      await axios.delete(`http://localhost:8080/api/categories/${categoryToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const nextCategories = categories.filter((cat) => cat.id !== categoryToDelete.id);
      setCategories(nextCategories);
      setSuccess("Categoría eliminada correctamente.");
      toast.success("La categoría se ha eliminado correctamente.", "Categoría eliminada");
      setError("");
      setCategoryToDelete(null);

      const nextTotalPages = Math.max(1, Math.ceil(nextCategories.length / ITEMS_PER_PAGE));
      setCurrentPage((page) => Math.min(page, nextTotalPages));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setCategoryToDelete(null);
      if (err.response?.status === 409) {
        setError("No se puede eliminar: tiene productos asociados.");
        toast.error("No se puede eliminar una categoría con productos asociados.");
      } else {
        setError("Error al eliminar.");
        toast.error("No se pudo eliminar la categoría.");
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

        <div className="admin-cat-search-row">
          <input
            type="text"
            className="admin-cat-search-input"
            placeholder="Buscar categoría por nombre"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="cat-list">
          {categories.length === 0 ? (
            <p className="no-cats">No hay categorías.</p>
          ) : filteredCategories.length === 0 ? (
            <p className="no-cats">No hay categorías que coincidan con la búsqueda.</p>
          ) : (
            paginatedCategories.map((cat) => (
              <div key={cat.id} className="cat-card">
                <span>
                  {cat.name} - <strong>{cat.productCount}</strong> producto
                  {cat.productCount !== 1 && "s"}
                </span>
                <button
                  className="delete-btn small-btn category-delete-btn"
                  onClick={() => setCategoryToDelete(cat)}
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
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
      </div>

      <ConfirmModal
        open={Boolean(categoryToDelete)}
        title="Eliminar categoría"
        message={
          categoryToDelete
            ? `¿Seguro que quieres eliminar la categoría ${categoryToDelete.name}?`
            : ""
        }
        confirmText="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  );
}

export default ManageCategories;
