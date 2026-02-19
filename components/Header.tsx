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
        <button onClick={() => navigate("/")}>TV Ao Vivo</button>
        <button onClick={() => navigate("/")}>Filmes</button>
        <button onClick={() => navigate("/")}>Séries</button>
        <button onClick={() => navigate("/")}>Minha Lista</button>
      </nav>

      <div className="profile" onClick={onLogout}>
        Sair
      </div>
    </header>
  );
}