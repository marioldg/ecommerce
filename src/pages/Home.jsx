import { Link } from "react-router-dom";
import { products } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Home() {
  const { addItem } = useCart();
  const destacados = products.slice(0, 4);

  return (
    <>
      <header style={{ marginBottom: 16 }}>
        <h1>Bienvenido a ReactShop</h1>
        <p className="muted">Tu tienda demo hecha en React.</p>
        <Link to="/catalog" className="btn">Ver Catálogo</Link>
      </header>
      <h2>Destacados</h2>
      <section className="grid">
        {destacados.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={() => addItem(p)} />
        ))}
      </section>
    </>
  );
}
