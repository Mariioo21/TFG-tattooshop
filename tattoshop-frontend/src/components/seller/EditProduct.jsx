import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil } from "lucide-react";
import { getToken } from "../../services/authService";
import "../../styles/EditProduct.css";

function EditProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [searchText, setSearchText] = useState("");
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
      .then((res) => setProducts(res.data || []))
      .catch(() => {});

    axios
      .get("http://localhost:8080/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
  }, []);

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    setMessage("");

    const selected = products.find((p) => p.id === parseInt(id, 10));
    if (selected) {
      setProductData({
        name: selected.name || "",
        description: selected.description || "",
        price: selected.price || "",
        imageURL: selected.imageURL || "",
        categoryName: selected.category?.name || "",
      });
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.trim().toLowerCase())
  );

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedId) {
      setMessage("Selecciona un producto para editar.");
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

      const updatedProduct = updated.data;
      setProducts((prev) =>
        prev.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      setProductData({
        name: updatedProduct.name || "",
        description: updatedProduct.description || "",
        price: updatedProduct.price || "",
        imageURL: updatedProduct.imageURL || "",
        categoryName: updatedProduct.category?.name || "",
      });
      setMessage("Cambios guardados correctamente.");
      setTimeout(() => setMessage(""), 2500);
    } catch {
      setMessage("Error al actualizar el producto.");
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-container">
        <h2 className="edit-title">
          <Pencil size={28} />
          <span>Editar producto</span>
        </h2>

        <input
          type="text"
          className="product-search"
          placeholder="Buscar producto por nombre"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="product-select"
          value={selectedId}
          onChange={handleSelect}
        >
          <option value="">Selecciona un producto</option>
          {filteredProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>

        {selectedId && (
          <div className="edit-content">
            <div className="preview-box">
              <div className="preview-media">
                <img
                  src={
                    productData.imageURL ||
                    "https://via.placeholder.com/480x320?text=Vista+previa"
                  }
                  alt="vista previa"
                  className="preview-img"
                />
              </div>

              <div className="preview-info">
                <p className="preview-tag">
                  {productData.categoryName || "Categoría"}
                </p>
                <h3 className="pv-name">
                  {productData.name || "Nombre del producto"}
                </h3>
                <p className="pv-desc">
                  {productData.description ||
                    "La vista previa del producto se actualizará mientras edites el formulario."}
                </p>
                <p className="pv-price">
                  {productData.price ? `${productData.price} €` : "0 €"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="edit-form">
              <input
                type="text"
                name="name"
                placeholder="Nombre del producto"
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
                placeholder="URL de la imagen"
                value={productData.imageURL}
                onChange={handleChange}
              />

              <select
                name="categoryName"
                value={productData.categoryName}
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
                Guardar cambios
              </button>

              {message && <p className="edit-message">{message}</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditProduct;
