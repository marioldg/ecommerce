import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

// Genera un id de pedido legible: AAA-999999 (timestamp base36)
const genOrderId = () => {
  const base = (Date.now()).toString(36).toUpperCase();
  return `${base.slice(0,3)}-${base.slice(3)}`;
};

export default function Checkout() {
  const { items, totalPrice, clear } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    card: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    card: "",
    expiry: "",
    cvv: "",
  });

  // ====== Fecha: validación robusta con ventana de siglo ======
  const normalizeTwoDigitYear = (yyStr) => {
    const yy = parseInt(yyStr, 10);
    if (yy >= 0 && yy <= 49) return 2000 + yy; // 00-49 => 2000-2049
    return 1900 + yy; // 50-99 => 1900-1999
  };
  const endOfMonthDate = (year, month1to12) =>
    new Date(year, month1to12, 0, 23, 59, 59, 999);
  const isCardExpired = (mmYY, now = new Date()) => {
    if (!/^((0[1-9])|(1[0-2]))\/\d{2}$/.test(mmYY)) return true;
    const [mm, yy] = mmYY.split("/");
    const month = parseInt(mm, 10);
    const year = normalizeTwoDigitYear(yy);
    const expiryEnd = endOfMonthDate(year, month);
    return expiryEnd < now;
  };

  // ====== Validadores ======
  const validateEmail = (v) => /^\S+@\S+\.\S+$/.test(v);
  const onlyDigits = (s) => s.replace(/\D/g, "");
  const validateCard = (v) => /^\d{16}$/.test(onlyDigits(v));
  const validateCVV = (v) => /^\d{3}$/.test(v);
  const validateExpiry = (v) => /^((0[1-9])|(1[0-2]))\/\d{2}$/.test(v) && !isCardExpired(v);

  // ====== Formateadores ======
  const formatCard = (v) => {
    const digits = onlyDigits(v).slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };
  const formatExpiry = (v) => {
    const digits = onlyDigits(v).slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0,2)}/${digits.slice(2)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;
    if (name === "card") nextValue = formatCard(value);
    if (name === "expiry") nextValue = formatExpiry(value);

    setForm((f) => ({ ...f, [name]: nextValue }));

    setErrors((prev) => {
      const draft = { ...prev };
      if (name === "email") draft.email = validateEmail(nextValue) ? "" : "Email no válido";
      if (name === "card") draft.card = validateCard(nextValue) ? "" : "La tarjeta debe tener 16 dígitos";
      if (name === "expiry") draft.expiry = validateExpiry(nextValue) ? "" : "Tarjeta caducada o formato MM/AA incorrecto";
      if (name === "cvv") draft.cvv = validateCVV(nextValue) ? "" : "CVV debe tener exactamente 3 dígitos";
      return draft;
    });

    setPaymentError("");
  };

  // ====== Flags ======
  const allFilled = useMemo(
    () => form.name.trim() && form.email.trim() && form.card.trim() && form.expiry.trim() && form.cvv.trim(),
    [form]
  );
  const noFieldErrors = useMemo(
    () => !errors.email && !errors.card && !errors.expiry && !errors.cvv,
    [errors]
  );
  const canPay = allFilled && noFieldErrors && items.length > 0;

  const onSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {
      email: validateEmail(form.email) ? "" : "Email no válido",
      card: validateCard(form.card) ? "" : "La tarjeta debe tener 16 dígitos",
      expiry: validateExpiry(form.expiry) ? "" : "Tarjeta caducada o formato MM/AA incorrecto",
      cvv: validateCVV(form.cvv) ? "" : "CVV debe tener exactamente 3 dígitos",
    };
    setErrors(nextErrors);

    const hasAnyError = Object.values(nextErrors).some(Boolean) || items.length === 0;
    if (hasAnyError) {
      setPaymentError("Error en el pago: revisa los datos introducidos.");
      return;
    }

    setProcessing(true);

    // --- Snapshot del pedido ANTES de vaciar el carrito ---
    const order = {
      id: genOrderId(),
      items: items.map(i => ({ ...i })), // copia para no perder cantidades
      total: totalPrice,
      buyer: { name: form.name, email: form.email },
      createdAt: new Date().toISOString(),
    };

    // Simulación de pasarela:
    setTimeout(() => {
      setPaid(true);
      clear(); // vacía carrito
      setProcessing(false);
      setPaymentError("");
      // Navega a la página de éxito con el resumen del pedido
      navigate("/success", { state: { order }, replace: true });
    }, 900);
  };

  if (items.length === 0 && !paid) {
    return (
      <section className="container">
        <h1>Pasarela de pago</h1>
        <p className="muted">Tu carrito está vacío.</p>
        <Link to="/catalog" className="btn">Volver al catálogo</Link>
      </section>
    );
  }

  return (
    <section className="container">
      <nav style={{ marginBottom: 12 }}>
        <button className="btn" onClick={() => navigate(-1)}>⟵ Volver</button>
      </nav>

      <div className="card" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="card-body" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <h1 style={{ margin: 0 }}>Finalizar compra</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            Pasarela de pago ficticia para pruebas.
          </p>
        </div>

        <div
          className="card-body"
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "1fr 360px",
          }}
        >
          {/* Formulario */}
          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
            <label>
              <div className="muted">Nombre y apellidos</div>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
                style={inputStyle}
              />
            </label>

            <label>
              <div className="muted">Email</div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tucorreo@ejemplo.com"
                required
                style={{ ...inputStyle, ...(errors.email ? errorInputStyle : null) }}
              />
              {errors.email && <small style={errorTextStyle}>{errors.email}</small>}
            </label>

            <label>
              <div className="muted">Número de tarjeta</div>
              <input
                name="card"
                inputMode="numeric"
                value={form.card}
                onChange={handleChange}
                placeholder="0000 0000 0000 0000"
                required
                maxLength={19}
                style={{ ...inputStyle, ...(errors.card ? errorInputStyle : null) }}
              />
              {errors.card && <small style={errorTextStyle}>{errors.card}</small>}
            </label>

            <div style={{ display: "flex", gap: 12 }}>
              <label style={{ flex: 1 }}>
                <div className="muted">Caducidad</div>
                <input
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                  placeholder="MM/AA"
                  required
                  inputMode="numeric"
                  maxLength={5}
                  style={{ ...inputStyle, ...(errors.expiry ? errorInputStyle : null) }}
                />
                {errors.expiry && <small style={errorTextStyle}>{errors.expiry}</small>}
              </label>

              <label style={{ width: 120 }}>
                <div className="muted">CVV</div>
                <input
                  name="cvv"
                  inputMode="numeric"
                  value={form.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  required
                  maxLength={3}
                  style={{ ...inputStyle, ...(errors.cvv ? errorInputStyle : null) }}
                />
                {errors.cvv && <small style={errorTextStyle}>{errors.cvv}</small>}
              </label>
            </div>

            {paymentError && (
              <div className="card" style={errorCardStyle}>
                <div className="card-body" style={{ padding: "8px 12px" }}>
                  <strong>⚠️ {paymentError}</strong>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button type="submit" disabled={!canPay || processing} style={buttonStyle}>
                {processing ? "Procesando..." : `Pagar € ${totalPrice.toFixed(2)}`}
              </button>
              <Link to="/cart" style={buttonStyle}>
                Volver al carrito
              </Link>
            </div>
          </form>

          {/* Resumen naranja */}
          <aside
            className="card"
            style={{
              alignSelf: "start",
              backgroundColor: "rgba(248, 178, 106, 0.25)",
              border: "1px solid rgba(248, 178, 106, 0.6)",
            }}
          >
            <div className="card-body">
              <div className="card-title">Resumen</div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {items.map((i) => (
                  <li key={i.id} className="muted" style={{ marginBottom: 6 }}>
                    {i.qty} × {i.name}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="card-body"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid rgba(248,178,106,0.4)",
              }}
            >
              <div className="muted">Total</div>
              <strong>€ {totalPrice.toFixed(2)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* 🎨 Estilos coherentes con tu app */
const inputStyle = {
  width: "100%",
  padding: 10,
  borderRadius: 12,
  border: "1px solid #1f2937",
  background: "#68a5dfff",
  color: "var(--text)",
};
const errorInputStyle = {
  outline: "2px solid #ef4444",
  borderColor: "#ef4444",
};
const errorTextStyle = {
  color: "#ef4444",
  marginTop: 4,
  display: "block",
};
const errorCardStyle = {
  background: "rgba(239, 68, 68, 0.12)",
  border: "1px solid rgba(239,68,68,0.28)",
};
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
