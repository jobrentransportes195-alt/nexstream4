import { useState } from "react";
import { content } from "../data/content";
import Player from "./Player";
import SearchBar from "./SearchBar";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const filtered = content.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <SearchBar onSearch={setSearch} />

      <div style={grid}>
        {filtered.map((item) => (
          <div
            key={item.title}
            style={card}
            onClick={() => setSelected(item)}
          >
            <img src={item.image} style={{ width: "100%", borderRadius:"8px" }} />
            <h4>{item.title}</h4>
            <p>⭐ {item.rating}</p>
          </div>
        ))}
      </div>

      {selected && <Player url={selected.video} />}
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: "20px",
  marginTop: "20px"
};

const card = {
  background: "#222",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "0.3s"
};