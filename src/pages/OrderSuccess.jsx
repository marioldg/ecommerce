import { Link, useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation() || {};
  const order = state?.order;

  // Si se accede directamente sin state, redirige al catálogo
  if (!order) {
    return (
      <section className="container">
        <h1>Pedido</h1>
        <p className="muted">No hay información de pedido disponible.</p>
        <Link to="/catalog" className="btn">Ir al catálogo</Link>
      </section>
    );
  }

  const { id, items, total, buyer, createdAt } = order;

  return (
    <section className="container">
      <nav style={{ marginBottom: 12 }}>
        <button className="btn" onClick={() => navigate("/")}>⟵ Ir al inicio</button>
      </nav>

      <div className="card" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="card-body" style={{ textAlign: "center" }}>
          <h1 style={{ marginBottom: 6 }}>¡Pedido completado con éxito! </h1>
          <p className="muted">Gracias por tu compra. Te hemos enviado un email con el resumen de tu pedido.</p>
        </div>

        {/* Resumen del pedido */}
        <div
          className="card-body"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 16,
            alignItems: "start",
          }}
        >
          <div className="card">
            <div className="card-body">
              <div className="card-title">Detalles del pedido</div>
              <div className="muted" style={{ marginBottom: 8 }}>
                Nº de pedido: <strong>{id}</strong>
              </div>
              <div className="muted" style={{ marginBottom: 8 }}>
                Fecha: <strong>{new Date(createdAt).toLocaleString()}</strong>
              </div>
              {buyer?.name && (
                <div className="muted" style={{ marginBottom: 8 }}>
                  Comprador: <strong>{buyer.name}</strong>
                </div>
              )}
              {buyer?.email && (
                <div className="muted" style={{ marginBottom: 8 }}>
                  Email: <strong>{buyer.email}</strong>
                </div>
              )}
            </div>

            <div className="card-body" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <div className="card-title">Artículos</div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {items.map((i) => (
                  <li key={i.id} className="muted" style={{ marginBottom: 6 }}>
                    {i.qty} × {i.name} — € {(i.price * i.qty).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside
            className="card"
            style={{
              backgroundColor: "rgba(248, 178, 106, 0.25)",
              border: "1px solid rgba(248, 178, 106, 0.6)",
            }}
          >
            <div className="card-body">
              <div className="card-title">Resumen</div>
              <div className="muted" style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span>Artículos</span>
                <strong>{items.reduce((a, b) => a + b.qty, 0)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(248,178,106,0.4)", paddingTop: 8 }}>
                <span className="muted">Total</span>
                <strong>€ {total.toFixed(2)}</strong>
              </div>
            </div>
          </aside>
        </div>

        <div className="card-body" style={{ textAlign: "center" }}>
          <Link to="/catalog" style={buttonStyle}>Seguir comprando</Link>
          <span style={{ display: "inline-block", width: 8 }} />
          <Link to="/" style={buttonStyle}>Ir al inicio</Link>
        </div>
      </div>
    </section>
  );
}

const buttonStyle = {
  backgroundColor: "#fca028ff",
  border: "none",
  color: "#1a1a1a",
  fontWeight: "700",
  fontSize: "1rem",
  padding: "10px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  textDecoration: "none",
  transition: "background-color 0.15s ease, transform 0.08s ease",
  display: "inline-block",
};
