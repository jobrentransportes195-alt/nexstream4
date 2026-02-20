import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Home({ category }: any) {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, [category]);

  async function fetchMovies() {
    setLoading(true);

    let query = supabase.from("movies").select("*");

    if (category !== "Home") {
      query = query.eq("category", category);
    }

    const { data } = await query;
    setMovies(data || []);
    setLoading(false);
  }

  const filtered = movies.filter((m) =>
    m.title?.toLowerCase().includes(search.toLowerCase())
  );

  const hero = filtered[0];

  return (
    <div className="home-container">

      {/* HERO */}
      {hero && (
        <div
          className="hero"
          style={{ backgroundImage: `url(${hero.image})` }}
        >
          <div className="hero-overlay">
            <h1>{hero.title}</h1>
            <p>{hero.description}</p>
            <button onClick={() => navigate(`/filme/${hero.id}`)}>
              ▶ Assistir
            </button>
          </div>
        </div>
      )}

      <input
        placeholder="Buscar..."
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Carregando...</p>}

      {!loading && filtered.length === 0 && (
        <p style={{ marginTop: 40 }}>Nenhum filme encontrado</p>
      )}

      <div className="grid-container">
        {filtered.map((movie) => (
          <div
            key={movie.id}
            className="card"
            onClick={() => navigate(`/filme/${movie.id}`)}
          >
            <img src={movie.image} />
            <div className="card-info">
              <h4>{movie.title}</h4>
              <p>⭐ {movie.rating}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}