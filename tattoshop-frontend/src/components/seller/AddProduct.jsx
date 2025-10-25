import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../services/authService";
import "../../styles/AddProduct.css";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageURL: "",
    categoryName: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    try {
      await axios.post(
        "http://localhost:8080/api/products",
        {
          name: product.name,
          description: product.description,
          price: product.price,
          imageURL: product.imageURL,
          category: { name: product.categoryName },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Producto añadido correctamente 🎉");
      setProduct({
        name: "",
        description: "",
        price: "",
        imageURL: "",
        categoryName: "",
      });
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("❌ Error al añadir producto");
    }
  };

  return (
    <div className="add-container">
      <h2>➕ Añadir producto</h2>

      <div className="add-content">
        
        {/* Vista previa del producto */}
        <div className="preview-box">
          <img
            src={product.imageURL || "https://via.placeholder.com/200"}
            alt="vista previa"
            className="preview-img"
          />
          <h3 className="pv-name">{product.name || "Nombre del producto"}</h3>
          {product.price && (
            <p className="pv-price">{product.price} €</p>
          )}
          {product.categoryName && (
            <p className="pv-cat">{product.categoryName}</p>
          )}
          {product.description && (
            <p className="pv-desc">{product.description}</p>
          )}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="add-form">
          <input
            type="text"
            name="name"
            placeholder="Nombre del producto"
            value={product.name}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Descripción"
            value={product.description}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Precio (€)"
            value={product.price}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="imageURL"
            placeholder="URL de la imagen"
            value={product.imageURL}
            onChange={handleChange}
          />

          <input
            type="text"
            name="categoryName"
            placeholder="Categoría"
            value={product.categoryName}
            onChange={handleChange}
          />

          <button type="submit" className="save-btn">
            Guardar producto
          </button>
        </form>
      </div>

      {message && <p className="add-message">{message}</p>}
    </div>
  );
}

export default AddProduct;
