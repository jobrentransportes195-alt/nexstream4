import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header style={{
      position: "fixed",
      top: 0,
      width: "100%",
      height: 70,
      background: "#111",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      color: "white",
      zIndex: 1000
    }}>
      <div onClick={() => navigate("/")}>NexStream</div>

      <div>
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/filmes")}>Filmes</button>
        <button onClick={() => navigate("/series")}>Séries</button>
      </div>

      <button onClick={onLogout}>Sair</button>
    </header>
  );
}