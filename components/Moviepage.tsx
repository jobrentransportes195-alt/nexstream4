import { useParams } from "react-router-dom";
import { content } from "../data/content";
import Player from "./Player";
import { useState } from "react";

export default function MoviePage() {
  const { id } = useParams();
  const movie = content.find(item => item.id === id);
  const [play, setPlay] = useState(false);

  if (!movie) return <div>Filme não encontrado</div>;

  return (
    <div style={{ padding: "20px" }}>
      <img
        src={movie.image}
        style={{
          width: "100%",
          maxHeight: "400px",
          objectFit: "cover",
          borderRadius: "10px"
        }}
      />

      <h1>{movie.title}</h1>
      <p>{movie.description}</p>
      <p>⭐ {movie.rating}</p>

      <button
        onClick={() => setPlay(true)}
        style={{
          background: "#e50914",
          padding: "10px 20px",
          border: "none",
          color: "white",
          cursor: "pointer",
          borderRadius: "5px"
        }}
      >
        Assistir
      </button>

      {play && <Player url={movie.video} />}
    </div>
  );
}