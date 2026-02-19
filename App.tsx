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
        <Route path="/" element={<Home />} />
        <Route path="/filme/:id" element={<MoviePage />} />
      </Routes>
    </>
  );
}