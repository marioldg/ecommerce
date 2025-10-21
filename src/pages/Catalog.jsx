import { useMemo, useState } from "react";
import { products as allProducts, categories as allCategories } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";
import CategorySidebar from "../components/CategorySidebar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import SortSelect from "../components/SortSelect.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Catalog() {
  const { addItem } = useCart();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sort, setSort] = useState("relevance");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filtered = useMemo(() => {
    let list = [...allProducts];

    // Por categoría
    if (category !== "Todas") list = list.filter(p => p.category === category);

    // Por texto (nombre, marca, tags)
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Por precio
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (!Number.isNaN(min) && minPrice !== "") list = list.filter(p => p.price >= min);
    if (!Number.isNaN(max) && maxPrice !== "") list = list.filter(p => p.price <= max);

    // Orden
    switch (sort) {
      case "price-asc": list.sort((a,b) => a.price - b.price); break;
      case "price-desc": list.sort((a,b) => b.price - a.price); break;
      case "rating-desc": list.sort((a,b) => b.rating - a.rating); break;
      case "name-asc": list.sort((a,b) => a.name.localeCompare(b.name)); break;
      default: break; // relevancia = no orden especial
    }
    return list;
  }, [category, query, sort, minPrice, maxPrice]);

  return (
    <section className="container">
      <header style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>Catálogo</h1>
        <p className="muted">Explora por categorías, busca y ordena como en una tienda real.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}>
        <CategorySidebar
          categories={allCategories}
          selected={category}
          onSelect={setCategory}
        />

        <div style={{ display: "grid", gap: 12 }}>
          {/* Controles superiores */}
          <div className="card">
            <div className="card-body" style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 12 }}>
                <SearchBar value={query} onChange={setQuery} />
                <SortSelect value={sort} onChange={setSort} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                  <input
                    type="number"
                    placeholder="€ mín"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid #cbd5e1",
                      background: "#c8e4f7ff",       // azul claro
                      color: "#000000ff",           // texto azul oscuro legible
                      width: 140
                    }}
                  />
                  <input
                    type="number"
                    placeholder="€ máx"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid #cbd5e1",
                      background: "#c8e4f7ff",       // azul claro
                      color: "#000000ff",
                      width: 140
                    }}
                  />

             
                <div style={{ marginLeft: "auto" }} className="muted">
                  {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>

          {/* Grid de productos */}
          <section className="grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={() => addItem(p)} />
            ))}
          </section>
        </div>
      </div>
    </section>
  );
}
