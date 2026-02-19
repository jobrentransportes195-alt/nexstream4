import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { content } from "../data/content";
import Player from "./Player";
import SearchBar from "./SearchBar";

export default function Home({ category }: any) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  let filteredContent = content;

  if (category && category !== "Home") {
    filteredContent = content.filter(
      item => item.category === category
    );
  }

  filteredContent = filteredContent.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-container">
      <SearchBar onSearch={setSearch} />

      <div className="row">
        {filteredContent.map(item => (
          <div
            key={item.id}
            className="card"
            onClick={() => navigate(`/filme/${item.id}`)}
          >
            <img src={item.image} alt={item.title} />
            <div className="card-info">
              <h4>{item.title}</h4>
              <span>⭐ {item.rating}</span>
            </div>
          </div>
        ))}
      </div>

      {selected && <Player url={selected.video} />}
    </div>
  );
}