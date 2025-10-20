export default function CategorySidebar({ categories, selected, onSelect }) {
  return (
    <aside className="card" style={{ padding: 12, position: "sticky", top: 72 }}>
      <h3 style={{ marginTop: 0 }}>Categorías</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
        <li>
          <button
            className="btn"
            style={{ width: "100%", background: selected === "Todas" ? "#0f172a" : "" }}
            onClick={() => onSelect("Todas")}
          >
            Todas
          </button>
        </li>
        {categories.map((c) => (
          <li key={c.name}>
            <button
              className="btn"
              style={{ width: "100%", background: selected === c.name ? "#0f172a" : "" }}
              onClick={() => onSelect(c.name)}
            >
              {c.name} <span className="badge">{c.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
