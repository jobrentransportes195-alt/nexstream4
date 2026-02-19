import { useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("Home");

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <>
      <div className="navbar">
        <h2 style={{ color: "#e50914" }}>NexStream</h2>

        <button onClick={() => setSelectedCategory("Home")}>Home</button>
        <button onClick={() => setSelectedCategory("TV Ao Vivo")}>
          TV Ao Vivo
        </button>
        <button onClick={() => setSelectedCategory("Filmes")}>
          Filmes
        </button>
        <button onClick={() => setSelectedCategory("Séries")}>
          Séries
        </button>

        <button onClick={() => setUser(null)}>Sair</button>
      </div>

      <Home category={selectedCategory} />
    </>
  );
}