import { useState } from "react";
import { content } from "../data/content";
import Player from "./Player";
import SearchBar from "./SearchBar";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const categories = [...new Set(content.map(c => c.category))];

  return (
    <div className="home-container">
      <SearchBar onSearch={setSearch} />

      {categories.map(category => {
        const filtered = content.filter(
          item =>
            item.category === category &&
            item.title.toLowerCase().includes(search.toLowerCase())
        );

        if (filtered.length === 0) return null;

        return (
          <div key={category} className="category-section">
            <h2>{category}</h2>

            <div className="row">
              {filtered.map(item => (
                <div
                  key={item.title}
                  className="card"
                  onClick={() => setSelected(item)}
                >
                  <img src={item.image} />
                  <div className="card-info">
                    <h4>{item.title}</h4>
                    <span>⭐ {item.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {selected && <Player url={selected.video} />}
    </div>
  );
}