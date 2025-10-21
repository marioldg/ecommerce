export default function SearchBar({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Buscar productos..."
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid #0099ffff",
        background: "#c8e4f7ff",
        color: "var(--text)"
      }}
    />
  );
}
