import { useParams } from "react-router-dom";
import { useState } from "react";

export default function MoviePage() {
  const { id } = useParams();

  const [rating, setRating] = useState(0);

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-4">
        Página do Filme ID: {id}
      </h1>

      <div className="flex gap-2 mb-6">
        {[1,2,3,4,5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            className={`cursor-pointer text-2xl ${
              star <= rating ? "text-yellow-400" : "text-gray-500"
            }`}
          >
            ⭐
          </span>
        ))}
      </div>

      <button
        className="bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700"
      >
        ▶ Assistir
      </button>
    </div>
  );
}