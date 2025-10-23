import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, totalItems, totalPrice, inc, dec, setQty, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <section>
        <h1>Carrito</h1>
        <p className="muted">Tu carrito está vacío. ¡Añade productos desde el catálogo!</p>
      </section>
    );
  }

  return (
    <section>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Carrito</h1>
        <span className="muted">({totalItems} artículo{totalItems !== 1 ? "s" : ""})</span>
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {items.map((i) => (
          <article key={i.id} className="card" style={{ display: "grid", gridTemplateColumns: "96px 1fr auto", gap: 12 }}>
            <img src={i.image} alt={i.name} style={{ width: 96, height: 96, objectFit: "cover" }} />
            <div className="card-body" style={{ padding: 12 }}>
              <h3 className="card-title" style={{ marginBottom: 6 }}>{i.name}</h3>
              <div className="muted" style={{ marginBottom: 8 }}>€ {i.price.toFixed(2)} c/u</div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className="btn" onClick={() => dec(i.id)}>-</button>
                <input
                  type="number"
                  min="1"
                  value={i.qty}
                  onChange={(e) => setQty(i.id, Number(e.target.value))}
                  style={{ width: 64, padding: 8, borderRadius: 10, border: "1px solid #000000ff", background: "#f8b806ff", color: "var(--text)" }}
                />
                <button className="btn" onClick={() => inc(i.id)}>+</button>

                <button className="btn" onClick={() => removeItem(i.id)} style={{ marginLeft: 8 }}>
                  Quitar
                </button>
              </div>
            </div>

            <div style={{ padding: 12, display: "flex", alignItems: "center" }}>
              <strong>€ {(i.qty * i.price).toFixed(2)}</strong>
            </div>
          </article>
        ))}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-body" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="muted">Subtotal</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>€ {totalPrice.toFixed(2)}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={clear}>Vaciar carrito</button>
            <button className="btn">Finalizar compra</button>
          </div>
        </div>
      </div>
    </section>
  );
}
