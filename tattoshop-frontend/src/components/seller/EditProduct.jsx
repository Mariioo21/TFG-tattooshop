import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../services/authService";
import "../../styles/EditProduct.css";

function EditProduct() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    imageURL: "",
    categoryName: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    axios
      .get("http://localhost:8080/api/products/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch(() => {});
  }, []);

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    const selected = products.find((p) => p.id === parseInt(id));
    if (selected) {
      setProductData({
        name: selected.name,
        description: selected.description,
        price: selected.price,
        imageURL: selected.imageURL || "",
        categoryName: selected.category?.name || "",
      });
    }
  };

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) {
      setMessage("⚠️ Selecciona un producto para editar");
      return;
    }

    try {
      const token = getToken();
      const updated = await axios.put(
        `http://localhost:8080/api/products/${selectedId}`,
        {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          imageURL: productData.imageURL,
          category: { name: productData.categoryName },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Vista previa se actualiza en tiempo real
      const updatedProductData = updated.data;
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProductData.id ? updatedProductData : p))
      );
      setMessage("✅ Cambios guardados correctamente");
      setTimeout(() => setMessage(""), 2500);
    } catch (error) {
      setMessage("❌ Error al actualizar");
    }
  };

  return (
    <div className="edit-container">
      <h2>✏️ Editar producto</h2>

      {/* SELECTOR  */}
      <select className="product-select" value={selectedId} onChange={handleSelect}>
        <option value="">-- Selecciona un producto --</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Vista previa + Formulario */}
      {selectedId && (
        <div className="edit-content">
          {/* 📌 Vista previa */}
          <div className="preview-box">
            <img
              src={productData.imageURL || "https://via.placeholder.com/200"}
              alt="preview"
              className="preview-img"
            />
            <h3>{productData.name}</h3>
            <p className="pv-price">{productData.price} €</p>
            {productData.categoryName && (
              <p className="pv-cat">{productData.categoryName}</p>
            )}
            <p className="pv-desc">{productData.description}</p>
          </div>

          {/* 📝 Formulario */}
          <form onSubmit={handleSubmit} className="edit-form">
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={productData.name}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Descripción"
              value={productData.description}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Precio (€)"
              value={productData.price}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="imageURL"
              placeholder="URL de imagen"
              value={productData.imageURL}
              onChange={handleChange}
            />

            <input
              type="text"
              name="categoryName"
              placeholder="Categoría"
              value={productData.categoryName}
              onChange={handleChange}
            />

            <button type="submit" className="save-btn">
              💾 Guardar cambios
            </button>

            {message && <p className="edit-message">{message}</p>}
          </form>
        </div>
      )}
    </div>
  );
}

export default EditProduct;
