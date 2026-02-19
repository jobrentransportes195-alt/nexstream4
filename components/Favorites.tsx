import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(saved);
  }, []);

  return (
    <div className="page-container">
      <h2>Minha Lista</h2>
      <div className="grid-container">
        {favorites.map(item => (
          <div key={item.id} className="card"
            onClick={() => navigate(`/filme/${item.id}`)}>
            <img src={item.image} />
            <div className="card-info">
              <h4>{item.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}