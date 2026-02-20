import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: userData } = await supabase.from("profiles").select("*");
    const { data: movieData } = await supabase.from("movies").select("*");
    const { count: favCount } = await supabase
      .from("favorites")
      .select("*", { count: "exact", head: true });

    setUsers(userData || []);
    setMovies(movieData || []);
    setStats({
      users: userData?.length || 0,
      movies: movieData?.length || 0,
      favorites: favCount || 0
    });
  }

  async function deleteMovie(id: string) {
    await supabase.from("movies").delete().eq("id", id);
    fetchData();
  }

  async function toggleAdmin(userId: string, currentRole: string) {
    await supabase
      .from("profiles")
      .update({ role: currentRole === "admin" ? "user" : "admin" })
      .eq("id", userId);

    fetchData();
  }

  return (
    <div style={{ padding: 30, color: "white" }}>
      <h1>👑 Painel Administrativo</h1>

      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
        <div className="admin-card">
          👥 Usuários: {stats.users}
        </div>
        <div className="admin-card">
          🎬 Canais: {stats.movies}
        </div>
        <div className="admin-card">
          ⭐ Favoritos: {stats.favorites}
        </div>
      </div>

      <h2>📺 Gerenciar Canais</h2>
      {movies.map(movie => (
        <div key={movie.id} className="admin-row">
          {movie.title}
          <button onClick={() => deleteMovie(movie.id)}>❌ Excluir</button>
        </div>
      ))}

      <h2 style={{ marginTop: 40 }}>👥 Gerenciar Usuários</h2>
      {users.map(user => (
        <div key={user.id} className="admin-row">
          {user.email} — {user.role}
          <button onClick={() => toggleAdmin(user.id, user.role)}>
            🔁 Tornar {user.role === "admin" ? "Usuário" : "Admin"}
          </button>
        </div>
      ))}
    </div>
  );
}