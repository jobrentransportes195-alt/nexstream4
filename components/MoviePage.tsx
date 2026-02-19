import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function MoviePage({ profile }: any) {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    fetchMovie();
  }, []);

  async function fetchMovie() {
    const { data } = await supabase
      .from("movies")
      .select("*")
      .eq("id", id)
      .single();

    setMovie(data);
  }

  async function addFavorite() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Faça login");
      return;
    }

    await supabase.from("favorites").insert({
      user_id: userData.user.id,
      movie_id: movie.id
    });

    alert("Adicionado aos favoritos");
  }

  if (!movie) return null;

  if (profile?.plan === "free") {
    return <h2>Upgrade para PRO para assistir</h2>;
  }

  return (
    <div style={{ paddingTop: 120, paddingLeft: 20 }}>
      <h1>{movie.title}</h1>
      <p>{movie.description}</p>
      <button onClick={addFavorite}>⭐ Favoritar</button>

      <video width="600" controls>
        <source src={movie.video} />
      </video>
    </div>
  );
}