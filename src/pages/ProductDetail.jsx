import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { products } from "../data/products.js";
import { useCart } from "../context/CartContext.jsx";
import ImageWithFallback from "../components/ImageWithFallback.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  // Nos aseguramos de comparar como string por si el id en data es numérico
  const product = useMemo(
    () => products.find((p) => String(p.id) === String(id)),
    [id]
  );

  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  // Manejo de producto no encontrado en la url

  if (!product) {
    return (
      <section>
        <h1>Producto no encontrado</h1>
        <Link to="/catalog" className="btn">Volver al catálogo</Link>
      </section>
    );
  }

  const { name, brand, category, image, price, rating, stock, tags = [] } = product;

  return (
    <section className="container">
      <nav className="muted" style={{ marginBottom: 12 }}>
        <Link to="/catalog" className="btn">⟵ Volver</Link>
      </nav>

      {/* Card principal con foto + datos */}
      <div
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(260px, 520px) 1fr",
          gap: 16,
        }}
      >
        <ImageWithFallback
          src={image}
          alt={name}
          className="card-img"
          style={{ width: "100%", height: 360, objectFit: "cover", borderTopRightRadius: 0, borderBottomLeftRadius: 16 }}
        />

        <div className="card-body" style={{ padding: 16 }}>
          <h1 style={{ marginTop: 0 }}>{name}</h1>
          <p className="muted" style={{ marginTop: -8 }}>
            {brand} • {category}
          </p>

          <div style={{ margin: "10px 0 14px" }}>
            <span className="badge">★ {Number(rating).toFixed(1)}</span>{" "}
            <span className="badge">{stock > 0 ? "En stock" : "Agotado"}</span>
          </div>

          <div style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 12 }}>
            € {Number(price).toFixed(2)}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) =>
                setQty(Math.max(1, Number(e.target.value) || 1))
              }
              style={{
                width: 80,
                padding: 10,
                borderRadius: 12,
                border: "1px solid #1f2937",
                background: "#ffae00ff",
                color: "var(--text)",
              }}
            />
            <button
              className="btn"
              onClick={() => {
                for (let i = 0; i < qty; i++) addItem(product);
              }}
              disabled={stock <= 0}
              title={stock <= 0 ? "No hay stock" : "Añadir al carrito"}
            >
              Añadir al carrito
            </button>
          </div>

          {!!tags.length && (
            <div
              className="muted"
              style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
            >
              {tags.map((t) => (
                <span
                  key={t}
                  className="badge"
                  style={{ background: "#22c55e", color: "#111827" }}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

       {/* Sugerencias */}
      <h3 style={{ marginTop: 20 }}>También te puede interesar</h3>

      {/* Grid con productos relacionados */}
      <div className="grid">
        {products
          // Filtro los productos de la misma categoría, excluyendo el actual
          .filter((p) => p.category === category && String(p.id) !== String(id))

          // Muestro solo los primeros 4 resultados
          .slice(0, 4)

          // Mapeo cada producto para crear su mini tarjeta con enlace al detalle
          .map((p) => (
            <Link key={p.id} to={`/product/${p.id}`} className="card">
              {/* Imagen del producto */}
              <ImageWithFallback className="card-img" src={p.image} alt={p.name} />

              {/* Contenido de la tarjeta: nombre + precio */}
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
