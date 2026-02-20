import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/")}>
        NexStream
      </div>

      <nav className="nav">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/filmes")}>Filmes</button>
        <button onClick={() => navigate("/series")}>Séries</button>
        <button onClick={() => navigate("/admin")}>Admin</button>
      </nav>

      <div className="profile" onClick={onLogout}>
        Sair
      </div>
    </header>
  );
}