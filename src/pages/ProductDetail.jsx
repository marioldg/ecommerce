import { useParams, Link } from "react-router-dom";
import { products } from "../data/products.js";
import { useCart } from "../context/CartContext.jsx";
import { useMemo, useState } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const product = useMemo(() => products.find(p => p.id === id), [id]);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <section>
        <h1>Producto no encontrado</h1>
        <Link to="/catalog" className="btn">Volver al catálogo</Link>
      </section>
    );
  }

  const { name, brand, category, image, price, rating, stock, tags } = product;

  return (
    <section>
      <nav className="muted" style={{ marginBottom: 12 }}>
        <Link to="/catalog" className="btn">⟵ Volver</Link>
      </nav>

      <div className="card" style={{ display: "grid", gridTemplateColumns: "minmax(260px, 520px) 1fr", gap: 16 }}>
        <img src={image} alt={name} style={{ width: "100%", height: 360, objectFit: "cover" }} />
        <div className="card-body" style={{ padding: 16 }}>
          <h1 style={{ marginTop: 0 }}>{name}</h1>
          <p className="muted" style={{ marginTop: -8 }}>{brand} • {category}</p>

          <div style={{ margin: "10px 0 14px" }}>
            <span className="badge">★ {rating.toFixed(1)}</span>{" "}
            <span className="badge">{stock > 0 ? "En stock" : "Agotado"}</span>
          </div>

          <div style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 12 }}>€ {price.toFixed(2)}</div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              style={{ width: 80, padding: 10, borderRadius: 12, border: "1px solid #1f2937", background: "#0b1220", color: "var(--text)" }}
            />
            <button className="btn" onClick={() => { for (let i = 0; i < qty; i++) addItem(product); }}>
              Añadir al carrito
            </button>
          </div>

          <div className="muted" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {tags.map(t => <span key={t} className="badge" style={{ background: "#22c55e", color: "#111827" }}>#{t}</span>)}
          </div>
        </div>
      </div>

      {/* Sugerencias simples */}
      <h3 style={{ marginTop: 20 }}>También te puede interesar</h3>
      <div className="grid">
        {products
          .filter(p => p.category === category && p.id !== id)
          .slice(0, 4)
          .map(p => (
            <Link key={p.id} to={`/product/${p.id}`} className="card">
              <img className="card-img" src={p.image} alt={p.name} />
              <div className="card-body">
                <div className="card-title">{p.name}</div>
                <div className="card-price">€ {p.price.toFixed(2)}</div>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}
