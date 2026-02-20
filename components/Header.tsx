import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onLogout: () => void;
  profile: any;
}

export default function Header({ onLogout, profile }: HeaderProps) {
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
        {profile?.role === "admin" && (
          <button onClick={() => navigate("/admin")}>Admin</button>
        )}
      </nav>

      <div className="profile-area">
        <span>{profile?.username || "Usuário"}</span>
        <button onClick={onLogout}>Sair</button>
      </div>
    </header>
  );
}