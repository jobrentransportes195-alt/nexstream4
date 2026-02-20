import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 80,
        background: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        color: "white",
        zIndex: 1000
      }}
    >
      <div
        style={{ fontSize: 22, fontWeight: "bold", cursor: "pointer", color: "red" }}
        onClick={() => navigate("/")}
      >
        NexStream
      </div>

      <nav style={{ display: "flex", gap: 20 }}>
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/filmes")}>Filmes</button>
        <button onClick={() => navigate("/series")}>Séries</button>
        <button onClick={() => navigate("/admin")}>Admin</button>
      </nav>

      <div
        style={{ cursor: "pointer" }}
        onClick={onLogout}
      >
        Sair
      </div>
    </header>
  );
}