import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import MoviePage from "./components/MoviePage";
import Favorites from "./components/Favorites";
import Profile from "./components/Profile";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  return (
    <>
      <Header onLogout={() => alert("Logout")} />

      <Routes>
        <Route path="/" element={<Home category="Home" />} />
        <Route path="/filmes" element={<Home category="Filmes" />} />
        <Route path="/series" element={<Home category="Séries" />} />
        <Route path="/tv" element={<Home category="TV" />} />
        <Route path="/filme/:id" element={<MoviePage />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </>
  );
}