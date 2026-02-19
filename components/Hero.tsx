import { useNavigate } from "react-router-dom";
import { content } from "../data/content";

export default function Hero() {
  const navigate = useNavigate();
  const movie = content[0];

  return (
    <div className="hero" style={{ backgroundImage: `url(${movie.image})` }}>
      <div className="hero-overlay">
        <h1>{movie.title}</h1>
        <p>{movie.description}</p>

        <div className="hero-buttons">
          <button onClick={() => navigate(`/filme/${movie.id}`)}>
            ▶ Assistir
          </button>
          <button onClick={() => {
            const fav = JSON.parse(localStorage.getItem("favorites") || "[]");
            localStorage.setItem("favorites", JSON.stringify([...fav, movie]));
            alert("Adicionado aos favoritos");
          }}>
            ⭐ Minha Lista
          </button>
        </div>
      </div>
    </div>
  );
}