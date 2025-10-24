import React from "react";
import { useNavigate } from "react-router-dom";

function ProductItem({ product }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        cursor: "pointer",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src={product.imageURL || "https://via.placeholder.com/200"}
        alt={product.name}
        style={{ width: "100%", borderRadius: "8px" }}
      />
      <h3 style={{ marginTop: "10px" }}>{product.name}</h3>
      <strong>{product.price} €</strong>
    </div>
  );
}

export default ProductItem;