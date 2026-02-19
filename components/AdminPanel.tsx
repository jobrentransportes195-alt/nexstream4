import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function AdminPanel() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Filmes");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [rating, setRating] = useState(0);

  const [movies, setMovies] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    fetchMovies();
    fetchStats();
  }, []);

  async function fetchMovies() {
    const { data } = await supabase.from("movies").select("*");
    setMovies(data || []);
  }

  async function fetchStats() {
    const { count: users } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { count: totalMovies } = await supabase
      .from("movies")
      .select("*", { count: "exact", head: true });

    const { count: totalFavorites } = await supabase
      .from("favorites")
      .select("*", { count: "exact", head: true });

    setStats({ users, totalMovies, totalFavorites });
  }

  async function createMovie() {
    await supabase.from("movies").insert({
      title,
      description,
      category,
      image,
      video,
      rating
    });

    setTitle("");
    setDescription("");
    setImage("");
    setVideo("");
    setRating(0);

    fetchMovies();
    fetchStats();
  }

  async function deleteMovie(id: string) {
    await supabase.from("movies").delete().eq("id", id);
    fetchMovies();
    fetchStats();
  }

  return (
    <div style={{ paddingTop: 120, paddingLeft: 20 }}>
      <h2>👑 Painel Admin</h2>

      <h3>📊 Dashboard</h3>
      <p>Usuários: {stats.users}</p>
      <p>Filmes: {stats.totalMovies}</p>
      <p>Favoritos: {stats.totalFavorites}</p>

      <hr />

      <h3>🎬 Criar Filme</h3>

      <input
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />

      <input
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />

      <input
        placeholder="Categoria"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <br />

      <input
        placeholder="Imagem URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <br />

      <input
        placeholder="Vídeo URL"
        value={video}
        onChange={(e) => setVideo(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="Rating"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />
      <br />

      <button onClick={createMovie}>Criar Filme</button>

      <hr />

      <h3>📂 Lista de Filmes</h3>

      {movies.map(movie => (
        <div key={movie.id} style={{ marginBottom: 10 }}>
          {movie.title}
          <button onClick={() => deleteMovie(movie.id)}>
            ❌ Excluir
          </button>
        </div>
      ))}
    </div>
  );
}