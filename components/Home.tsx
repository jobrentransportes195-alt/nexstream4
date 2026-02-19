import { useState } from "react";

const categories = {
  "TV Ao Vivo": ["Globo", "SBT", "Record"],
  "Filmes": ["Vingadores", "Avatar", "Batman"],
  "Séries": ["Breaking Bad", "La Casa de Papel", "Dark"],
  "Esportes": ["ESPN", "Sportv"],
  "Infantil": ["Cartoon Network", "Nickelodeon"]
};

export default function Home() {
  const [favorites, setFavorites] = useState<string[]>(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );

  const toggleFavorite = (item: string) => {
    let updated;
    if (favorites.includes(item)) {
      updated = favorites.filter(f => f !== item);
    } else {
      updated = [...favorites, item];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <>
      {Object.entries(categories).map(([category, items]) => (
        <div className="section" key={category}>
          <h2>{category}</h2>
          <div className="row">
            {items.map(item => (
              <div className="card" key={item}>
                <button
                  className="favorite-btn"
                  onClick={() => toggleFavorite(item)}
                >
                  {favorites.includes(item) ? "✔" : "♡"}
                </button>
                <div className="card-title">{item}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}