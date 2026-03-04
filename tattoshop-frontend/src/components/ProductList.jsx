import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react";
import { getUserFromToken } from "../services/authService";
import "../styles/ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name-asc");

  const location = useLocation();
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 6;

  const searchQuery = new URLSearchParams(location.search).get("search") || "";
  const categoryQuery = new URLSearchParams(location.search).get("category") || "";

  const categories = useMemo(() => {
    const names = products.map((product) => product.category?.name).filter(Boolean);
    return [...new Set(names)].sort((a, b) => a.localeCompare(b));
  }, [products]);

  useEffect(() => {
    const user = getUserFromToken();
    if (user && !sessionStorage.getItem("welcomeShown")) {
      setWelcomeMessage(`Bienvenido de nuevo, ${user.username}`);
      sessionStorage.setItem("welcomeShown", "true");
      setTimeout(() => setWelcomeMessage(""), 4000);
    }

    axios
      .get("http://localhost:8080/api/products")
      .then((response) => {
        const data = response.data.content || response.data;
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q)
      );
    }

    if (categoryQuery) {
      result = result.filter((product) => product.category?.name === categoryQuery);
    }

    if (priceMin) result = result.filter((product) => product.price >= Number(priceMin));
    if (priceMax) result = result.filter((product) => product.price <= Number(priceMax));

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "name-asc":
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFiltered(result);
    setCurrentPage(1);
  }, [products, searchQuery, categoryQuery, priceMin, priceMax, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const resetFilters = () => {
    setPriceMin("");
    setPriceMax("");
    setSortBy("name-asc");
    setCurrentPage(1);
    navigate("/catalog");
  };

  const selectCategory = (categoryName) => {
    setCurrentPage(1);

    if (!categoryName) {
      navigate("/catalog");
      return;
    }

    navigate(`/catalog?category=${encodeURIComponent(categoryName)}`);
  };

  if (loading) return <p className="pl-loading">Cargando productos...</p>;

  return (
    <div className="pl-wrapper">
      {welcomeMessage && <div className="pl-welcome">{welcomeMessage}</div>}

      <section className="pl-hero">
        <div className="pl-hero-copy">
          <p className="pl-kicker">TattooShop</p>
          <h1 className="pl-title">Productos disponibles</h1>
          <p className="pl-subtitle">Explora todo el catálogo disponible de la tienda.</p>
        </div>

        <div className="pl-total-card">
          <span className="pl-total-label">Total productos</span>
          <strong className="pl-total-value">{filtered.length}</strong>
        </div>
      </section>

      <section className={`pl-content ${showFilters ? "has-sidebar" : "is-full"}`}>
        {showFilters && (
          <aside className="pl-sidebar">
            <div className="pl-sidebar-header">
              <h2>Filtros</h2>
              <button
                type="button"
                className="pl-icon-button"
                onClick={() => setShowFilters(false)}
                aria-label="Ocultar filtros"
              >
                Filtrar
              </button>
            </div>

            <div className="pl-filter-block">
              <h3>Categorías</h3>
              <div className="pl-category-list">
                <button
                  type="button"
                  className={`pl-category-button ${!categoryQuery ? "is-active" : ""}`}
                  onClick={() => selectCategory("")}
                >
                  Todos
                </button>

                {categories.map((categoryName) => (
                  <button
                    type="button"
                    key={categoryName}
                    className={`pl-category-button ${
                      categoryQuery === categoryName ? "is-active" : ""
                    }`}
                    onClick={() => selectCategory(categoryName)}
                  >
                    {categoryName}
                  </button>
                ))}
              </div>
            </div>

            <div className="pl-filter-block">
              <h3>Filtrar por precio</h3>

              <div className="pl-price-grid">
                <label className="pl-filter-field">
                  <span>Mínimo</span>
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    placeholder="0"
                  />
                </label>

                <label className="pl-filter-field">
                  <span>Máximo</span>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    placeholder="999"
                  />
                </label>
              </div>

              {(categoryQuery || searchQuery || priceMin || priceMax || sortBy !== "name-asc") && (
                <button className="pl-reset-button" onClick={resetFilters}>
                  Limpiar filtros
                </button>
              )}
            </div>
          </aside>
        )}

        <div className="pl-main">
          <div className="pl-actions">
            <div className="pl-actions-left">
              <div className="pl-view-toggle">
                <button
                  type="button"
                  className={`pl-view-button ${viewMode === "grid" ? "is-active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Vista cuadrícula"
                >
                  <LayoutGrid size={18} strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  className={`pl-view-button ${viewMode === "list" ? "is-active" : ""}`}
                  onClick={() => setViewMode("list")}
                  aria-label="Vista lista"
                >
                  <List size={18} strokeWidth={2.2} />
                </button>
              </div>

              <select
                className="pl-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Ordenar productos"
              >
                <option value="name-asc">Nombre A-Z</option>
                <option value="name-desc">Nombre Z-A</option>
                <option value="price-asc">Precio menor a mayor</option>
                <option value="price-desc">Precio mayor a menor</option>
              </select>
            </div>

            <button
              type="button"
              className="pl-toggle-filters"
              onClick={() => setShowFilters((current) => !current)}
            >
              {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="pl-empty-state">
              <h3>No se encontraron productos</h3>
              <p>Prueba a cambiar el rango, la categoría o la búsqueda.</p>
            </div>
          ) : (
            <>
              <div className={`pl-results ${viewMode === "list" ? "is-list" : "is-grid"}`}>
                {paginatedProducts.map((product) => (
                  <article
                    key={product.id}
                    className="pl-card"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="pl-image-wrapper">
                      <img
                        className="pl-image"
                        src={product.imageURL || "https://via.placeholder.com/240"}
                        alt={product.name}
                      />
                    </div>

                    <div className="pl-card-body">
                      {product.category && (
                        <span className="pl-category-chip">{product.category.name}</span>
                      )}
                      <h3 className="pl-name">{product.name}</h3>
                      <p className="pl-desc">{product.description}</p>
                      <div className="pl-meta">
                        <span className="pl-price">{product.price} €</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pl-pagination">
                  <button
                    type="button"
                    className="pl-page-arrow"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={safePage === 1}
                    aria-label="Página anterior"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="pl-page-list">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`pl-page-button ${safePage === page ? "is-active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="pl-page-arrow"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={safePage === totalPages}
                    aria-label="Página siguiente"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default ProductList;
