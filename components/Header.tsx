import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onLogout: () => void;
}

function Header({ onLogout }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/")}>
        NexStream
      </div>

      <nav className="nav">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/tv")}>TV Ao Vivo</button>
        <button onClick={() => navigate("/filmes")}>Filmes</button>
        <button onClick={() => navigate("/series")}>Séries</button>
      </nav>

      <div className="profile" onClick={onLogout}>
        Sair
      </div>
    </header>
  );
}

export default Header;