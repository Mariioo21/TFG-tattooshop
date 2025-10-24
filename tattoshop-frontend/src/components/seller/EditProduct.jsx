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

  // ✅ Cargar productos del vendedor autenticado
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    axios
      .get("http://localhost:8080/api/products/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error al cargar productos:", err));
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

  // ✅ Enviar actualización
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) {
      setMessage("⚠️ Selecciona un producto para editar");
      return;
    }

    try {
      const token = getToken(); // <-- se obtiene aquí por seguridad
      await axios.put(
        `http://localhost:8080/api/products/${selectedId}`,
        {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          imageURL: productData.imageURL,
          category: { name: productData.categoryName },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Producto actualizado correctamente");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      if (error.response?.status === 403) {
        setMessage("❌ No tienes permisos para actualizar este producto");
      } else {
        setMessage("❌ Error al actualizar producto");
      }
    }
  };

  return (
    <div className="edit-product-container">
      <h2>✏️ Editar producto</h2>

      <select
        className="product-select"
        value={selectedId}
        onChange={handleSelect}
      >
        <option value="">-- Selecciona un producto --</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {selectedId && (
        <form onSubmit={handleSubmit} className="edit-product-form">
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
          <button type="submit">💾 Guardar cambios</button>
        </form>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default EditProduct;
