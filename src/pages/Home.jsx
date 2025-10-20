import { Link } from "react-router-dom";
import { products } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Home() {
  const { addItem } = useCart();
  const destacados = products.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="hero container">
        <div className="hero-inner">
          <div>
            <div className="kicker">REACTSHOP</div>
            <h1 className="h1">Tecnología con estilo <br />al mejor precio</h1>
            <p className="lead">
              Explora un catálogo cuidado: audio, periféricos, monitores, smart home y más.
              Compra con una experiencia fluida y un carrito inteligente.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
              <Link to="/catalog" className="btn btn-primary">Explorar catálogo</Link>
              <Link to="/cart" className="btn btn-ghost">Ver carrito</Link>
            </div>
          </div>
          <div>
            <div className="card" style={{ padding: 16 }}>
              <div className="muted" style={{ marginBottom: 8 }}>Top Ventas</div>
              <div className="grid">
                {destacados.map(p => (
                  <ProductCard key={p.id} product={p} onAdd={() => addItem(p)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección destacados extendida */}
      <section className="container" style={{ marginTop: 22 }}>
        <h2 style={{ margin: "0 0 10px" }}>Recomendados para ti</h2>
        <div className="grid">
          {products.slice(4, 8).map(p => (
            <ProductCard key={p.id} product={p} onAdd={() => addItem(p)} />
          ))}
        </div>
      </section>
    </>
  );
}
