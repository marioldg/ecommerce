import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">ReactShop</Link>
        <div className="nav-links">
          <NavLink to="/" className="btn">Inicio</NavLink>
          <NavLink to="/catalog" className="btn">Catálogo</NavLink>
          <NavLink to="/cart" className="btn">
            Carrito
            <span style={{
              marginLeft: 8,
              fontSize: "0.75rem",
              background: "var(--accent)",
              color: "#111827",
              borderRadius: 999,
              padding: "2px 8px",
              fontWeight: 800
            }}>
              {totalItems}
            </span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
