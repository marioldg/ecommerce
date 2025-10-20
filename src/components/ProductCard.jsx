import { Link } from "react-router-dom";
import ImageWithFallback from "./ImageWithFallback.jsx";

export default function ProductCard({ product, onAdd }) {
  const { id, name, brand, price, image, stock } = product;

  return (
    <article className="card">
      <Link to={`/product/${id}`}>
        <ImageWithFallback className="card-img" src={image} alt={name} />
      </Link>
      <div className="card-body">
        <Link to={`/product/${id}`} className="card-title">{name}</Link>
        <div className="card-brand">{brand}</div>
        <div className="card-price">€ {price.toFixed(2)}</div>
        <div className="card-actions">
          <button className="btn" onClick={onAdd}>Añadir al carrito</button>
          <span className="badge">{stock > 0 ? "En stock" : "Agotado"}</span>
        </div>
      </div>
    </article>
  );
}
