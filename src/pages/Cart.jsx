import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, totalItems, totalPrice, inc, dec, setQty, removeItem, clear } = useCart();

  if (!items || items.length === 0) {
    return (
      <section className="container">
        <h1>Carrito</h1>
        <p className="muted">Tu carrito está vacío. ¡Añade productos desde el catálogo!</p>
        <Link to="/catalog" className="btn">Ir al catálogo</Link>
      </section>
    );
  }

  return (
    <section className="container">
      <h1>Carrito</h1>

      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 12 }}>
          {items.map((i) => (
            <div key={i.id} className="card" style={{ display: "grid", gridTemplateColumns: "64px 1fr auto", gap: 12, alignItems: "center" }}>
              <img src={i.image} alt={i.name} width={64} height={64} style={{ borderRadius: 8, objectFit: "cover" }} />
              <div>
                <div style={{ fontWeight: 700 }}>{i.name}</div>
                <div className="muted">€ {i.price.toFixed(2)} · {i.brand}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <button className="btn" onClick={() => dec(i.id)}>-</button>
                  <input
                    type="number"
                    min="1"
                    value={i.qty}
                    onChange={(e) => setQty(i.id, Math.max(1, Number(e.target.value) || 1))}
                    style={{ width: 64, padding: 8, borderRadius: 12, border: "1px solid #1f2937", background: "#ffbd08ff", color: "var(--text)" }}
                  />
                  <button className="btn" onClick={() => inc(i.id)}>+</button>
                  <button className="btn" onClick={() => removeItem(i.id)} style={{ marginLeft: 8 }}>
                    Quitar
                  </button>
                </div>
              </div>
              <div style={{ fontWeight: 700 }}>€ {(i.price * i.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="card-body" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="muted">Artículos</div>
            <div style={{ fontWeight: 700 }}>{totalItems}</div>
          </div>
          <div>
            <div className="muted">Subtotal</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>€ {totalPrice.toFixed(2)}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={clear}>Vaciar carrito</button>
            <Link to="/checkout" className="btn">Finalizar compra</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
