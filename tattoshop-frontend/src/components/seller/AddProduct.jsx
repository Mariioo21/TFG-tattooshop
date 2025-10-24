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

      setMessage("✅ Producto añadido correctamente");
      setProduct({
        name: "",
        description: "",
        price: "",
        imageURL: "",
        categoryName: "",
      });
    } catch (error) {
      console.error("Error al añadir producto:", error);
      setMessage("❌ Error al añadir producto (ver consola)");
    }
  };

  return (
    <div className="add-product-container">
      <h2>➕ Añadir nuevo producto</h2>

      <form onSubmit={handleSubmit} className="add-product-form">
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
          placeholder="Categoría (opcional)"
          value={product.categoryName}
          onChange={handleChange}
        />

        <button type="submit">Guardar producto</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default AddProduct;
