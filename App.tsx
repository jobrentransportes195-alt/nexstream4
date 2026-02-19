import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import MoviePage from "./components/MoviePage";

export default function App() {

  const handleLogout = () => {
    alert("Logout realizado");
  };

  return (
    <>
      <Header onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home category="Home" />} />
        <Route path="/filmes" element={<Home category="Filmes" />} />
        <Route path="/series" element={<Home category="Séries" />} />
        <Route path="/tv" element={<Home category="TV" />} />
        <Route path="/filme/:id" element={<MoviePage />} />
      </Routes>
    </>
  );
}