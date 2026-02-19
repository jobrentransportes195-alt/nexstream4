export default function SearchBar({ onSearch }: any) {
  return (
    <input
      type="text"
      placeholder="Buscar..."
      onChange={(e) => onSearch(e.target.value)}
      style={{
        padding: "8px",
        borderRadius: "4px",
        border: "none",
        marginLeft: "20px"
      }}
    />
  );
}