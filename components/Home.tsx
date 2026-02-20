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

    if (category !== "Home") {
      query = query.eq("category", category);
    }

    const { data } = await query;
    setMovies(data || []);
  }

  const filtered = movies.filter((m) =>
    m?.title?.toLowerCase()?.includes(search.toLowerCase())
  );

  return (
    <div style={{ paddingTop: 120, paddingLeft: 20 }}>
      <input
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {filtered.map((movie) => (
          <div
            key={movie.id}
            onClick={() => navigate(`/filme/${movie.id}`)}
            style={{ cursor: "pointer" }}
          >
            {movie.image && (
              <img src={movie.image} width="200" alt={movie.title} />
            )}
            <h4>{movie.title}</h4>
            <p>⭐ {movie.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}