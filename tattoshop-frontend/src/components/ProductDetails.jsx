import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ShoppingCart, Store, Tag } from "lucide-react";
import { getToken, getUserFromToken } from "../services/authService";
import "../styles/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");

  const user = getUserFromToken();
  const isUser = user?.role === "USER";
  const isReadonlyPreview = Boolean(location.state?.readonlyPreview);
  const token = getToken();

  const api = axios.create({
    baseURL: "http://localhost:8080/api/cart",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const changeQty = (value) => setQty(Math.max(1, Math.min(99, qty + value)));

  const inputQty = (e) => {
    const clean = e.target.value.replace(/\D/g, "");
    setQty(clean === "" ? 1 : Math.min(99, Number(clean)));
  };

  const goBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
      return;
    }

    navigate(`/catalog${location.search}`);
  };

  const addToCart = () => {
    if (!isUser) {
      setMessage("Solo los usuarios pueden comprar.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    api
      .post(`/add/${product.id}?qty=${qty}`)
      .then(() => {
        window.dispatchEvent(new Event("cartUpdated"));
        setMessage(`${qty} unidad(es) añadidas al carrito.`);
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(() => {
        setMessage("Error al añadir al carrito.");
        setTimeout(() => setMessage(""), 3000);
      });
  };

  if (loading) return <p className="pd-loading">Cargando...</p>;
  if (!product) return <p className="pd-notfound">Producto no encontrado.</p>;

  return (
    <div className="pd-page">
      <div className="pd-container">
        <button className="pd-back" onClick={goBack}>
          <ArrowLeft size={18} />
          <span>Volver</span>
        </button>

        <div className="pd-card">
          <div className="pd-media-panel">
            <div className="pd-image-shell">
              <img className="pd-image" src={product.imageURL} alt={product.name} />
            </div>
          </div>

          <div className="pd-info-panel">
            <img src="/logo.png" alt="TattooShop" className="pd-panel-logo" />
            <p className="pd-eyebrow">TATTOOSHOP</p>
            <h2 className="pd-name">{product.name}</h2>
            <p className="pd-desc">{product.description}</p>

            <div className="pd-meta-list">
              <div className="pd-meta-item pd-meta-price">
                <span className="pd-meta-label">Precio</span>
                <strong>{product.price} €</strong>
              </div>

              {product.category && (
                <div className="pd-meta-item">
                  <Tag size={16} />
                  <span>Categoría: {product.category.name}</span>
                </div>
              )}

              {product.seller && (
                <div className="pd-meta-item">
                  <Store size={16} />
                  <span>Vendedor: {product.seller.username}</span>
                </div>
              )}
            </div>

            {isUser && !isReadonlyPreview && (
              <div className="pd-purchase-box">
                <div className="pd-qty">
                  <button
                    className="pd-qty-btn"
                    type="button"
                    onClick={() => changeQty(-1)}
                  >
                    -
                  </button>
                  <input
                    className="pd-qty-input"
                    type="text"
                    value={qty}
                    onChange={inputQty}
                  />
                  <button
                    className="pd-qty-btn"
                    type="button"
                    onClick={() => changeQty(1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="pd-add-btn"
                  disabled={!isUser}
                  onClick={addToCart}
                >
                  <ShoppingCart size={18} />
                  <span>Añadir al carrito</span>
                </button>
              </div>
            )}

            {message && <p className="pd-toast">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
