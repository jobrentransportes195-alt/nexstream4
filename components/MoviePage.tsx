import { useParams } from "react-router-dom";
import { content } from "../data/content";
import { useState } from "react";

export default function MoviePage() {
  const { id } = useParams();
  const movie = content.find(item => item.id === id);

  const [rating, setRating] = useState(movie?.rating || 0);

  if (!movie) {
    return <div className="page-container">Filme não encontrado</div>;
  }

  return (
    <div className="page-container">
      <img src={movie.image} className="movie-banner" />

      <h1>{movie.title}</h1>
      <p>{movie.description}</p>

      <div className="stars">
        {[1,2,3,4,5].map(star => (
          <span
            key={star}
            onClick={() => setRating(star)}
            className={star <= rating ? "active-star" : ""}
          >
            ⭐
          </span>
        ))}
      </div>

      <video
        controls
        className="video-player"
        src={movie.video}
      />
    </div>
  );
}