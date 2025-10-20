export default function SortSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid #1f2937",
        background: "#0b1220",
        color: "var(--text)"
      }}
    >
      <option value="relevance">Relevancia</option>
      <option value="price-asc">Precio ↑</option>
      <option value="price-desc">Precio ↓</option>
      <option value="rating-desc">Mejor valorados</option>
      <option value="name-asc">Nombre A→Z</option>
    </select>
  );
}
