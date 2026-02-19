import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { content } from "../data/content";
import SearchBar from "./SearchBar";

interface HomeProps {
  category?: string;
}

export default function Home({ category }: HomeProps) {

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  let filteredContent = content;

  // 🔎 Filtro por categoria (mantido)
  if (category && category !== "Home") {
    filteredContent = filteredContent.filter(
      item => item.category === category
    );
  }

  // 🔎 Filtro por busca (mantido)
  filteredContent = filteredContent.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-container">

      <SearchBar onSearch={setSearch} />

      <div className="grid-container">
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

    </div>
  );
}