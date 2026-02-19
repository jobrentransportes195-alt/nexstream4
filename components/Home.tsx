import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Home({ category }: any) {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMovies();
  }, [category]);

  async function fetchMovies() {
    let query = supabase.from("movies").select("*");

    if (category && category !== "Home") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (!error) {
      setMovies(data || []);
    }
  }

  const filtered = movies.filter(movie =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ paddingTop: 120, paddingLeft: 20 }}>
      <input
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        {filtered.map(movie => (
          <div
            key={movie.id}
            onClick={() => navigate(`/filme/${movie.id}`)}
            style={{ cursor: "pointer", width: 180 }}
          >
            <img src={movie.image} width="180" />
            <h4>{movie.title}</h4>
            <p>⭐ {movie.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}