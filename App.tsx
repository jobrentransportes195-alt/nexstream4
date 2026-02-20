import { useEffect, useState } from "react";
import { supabase } from "./services/supabase";
import Home from "./components/Home";
import Login from "./components/Login";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 Pega sessão atual
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!error) {
        setUser(data.session?.user ?? null);
      }

      setLoading(false);
    };

    getSession();

    // 🔥 Escuta mudanças de login/logout
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 🔥 Tela de carregamento
  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0a0a0a",
        color: "white"
      }}>
        Carregando...
      </div>
    );
  }

  // 🔐 Se não tiver usuário → Login
  if (!user) {
    return <Login />;
  }

  // 🎬 Se tiver usuário → Home
  return <Home />;
}