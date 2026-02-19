import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import MoviePage from "./components/MoviePage";
import Login from "./components/Login";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: "#000", minHeight: "100vh" }}>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/filme/:id" element={<MoviePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;