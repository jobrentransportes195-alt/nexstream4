import { useEffect, useState } from "react";
import { supabase } from "./services/supabase";
import Home from "./components/Home";
import Login from "./components/Login";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 Pega sessão atual
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    checkSession();

    // 🔥 Escuta login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return null; // não trava mais em "carregando"
  }

  return user ? <Home /> : <Login />;
}