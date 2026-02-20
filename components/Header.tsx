import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  onLogout: () => void;
  profile: {
    username?: string;
    role?: string;
  } | null;
}

export default function Header({ onLogout, profile }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  function goTo(path: string) {
    navigate(path);
  }

  function isActive(path: string) {
    return location.pathname === path ? "active-nav" : "";
  }

  return (
    <header className="header">
      {/* LOGO */}
      <div className="logo" onClick={() => goTo("/")}>
        NexStream
      </div>

      {/* MENU */}
      <nav className="nav">
        <button
          className={isActive("/")}
          onClick={() => goTo("/")}
        >
          Home
        </button>

        <button
          className={isActive("/filmes")}
          onClick={() => goTo("/filmes")}
        >
          Filmes
        </button>

        <button
          className={isActive("/series")}
          onClick={() => goTo("/series")}
        >
          Séries
        </button>

        {profile?.role === "admin" && (
          <button
            className={isActive("/admin")}
            onClick={() => goTo("/admin")}
          >
            Admin
          </button>
        )}
      </nav>

      {/* PERFIL */}
      <div className="profile-area">
        <span className="username">
          {profile?.username || "Usuário"}
        </span>

        <button className="logout-btn" onClick={onLogout}>
          Sair
        </button>
      </div>
    </header>
  );
}