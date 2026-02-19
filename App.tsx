import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import MoviePage from "./components/MoviePage";
import { useState } from "react";

export default function App() {
  const [user, setUser] = useState<any>(true); // deixe true para não ir para login agora

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <>
      <div className="navbar">
        <h2 className="logo">NexStream</h2>

        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/tv">TV Ao Vivo</NavLink>
        <NavLink to="/filmes">Filmes</NavLink>
        <NavLink to="/series">Séries</NavLink>
      </div>

      <Routes>
        <Route path="/" element={<Home category="Home" />} />
        <Route path="/tv" element={<Home category="TV Ao Vivo" />} />
        <Route path="/filmes" element={<Home category="Filmes" />} />
        <Route path="/series" element={<Home category="Séries" />} />
    <Route path="/filme/:id" element={<MoviePage />} /> 
     </Routes>
    </>
  );
}