import { useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";

export default function App() {
  const [user, setUser] = useState<any>(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <>
      <div className="navbar">
        <h2 style={{color:"#e50914"}}>NexStream</h2>
        <button>Home</button>
        <button>TV Ao Vivo</button>
        <button>Filmes</button>
        <button>Séries</button>
        <button>Minha Lista</button>
        <button onClick={() => setUser(null)}>Sair</button>
      </div>

      <Home />
    </>
  );
}