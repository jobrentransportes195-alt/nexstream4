import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Player from "./components/Player";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/player/:url" element={<Player />} />
    </Routes>
  );
}

export default App;