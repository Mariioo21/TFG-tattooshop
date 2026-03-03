import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
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
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getToken();
        const res = await axios.get(
          "http://localhost:8080/api/categories",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCategories(res.data || []);
      } catch {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

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

      setMessage("Producto añadido correctamente.");
      setProduct({
        name: "",
        description: "",
        price: "",
        imageURL: "",
        categoryName: "",
      });
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Error al añadir producto.");
    }
  };

  return (
    <div className="add-page">
      <div className="add-container">
        <h2 className="add-title">
          <Plus size={28} />
          <span>Añadir producto</span>
        </h2>

        <div className="add-content">
          <div className="preview-box">
            <div className="preview-media">
              <img
                src={
                  product.imageURL ||
                  "https://via.placeholder.com/480x320?text=Vista+previa"
                }
                alt="vista previa"
                className="preview-img"
              />
            </div>

            <div className="preview-info">
              <p className="preview-tag">
                {product.categoryName || "Categoría"}
              </p>
              <h3 className="pv-name">
                {product.name || "Nombre del producto"}
              </h3>
              <p className="pv-desc">
                {product.description ||
                  "La vista previa del producto aparecerá aquí mientras completas el formulario."}
              </p>
              <p className="pv-price">
                {product.price ? `${product.price} €` : "0 €"}
              </p>
            </div>
          </div>

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

            <select
              name="categoryName"
              value={product.categoryName}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <button type="submit" className="save-btn">
              Guardar producto
            </button>
          </form>
        </div>

        {message && <p className="add-message">{message}</p>}
      </div>
    </div>
  );
}

export default AddProduct;
