import { useEffect, useState } from "react";
import { supabase } from "./services/supabase";
import Home from "./components/Home";
import Login from "./components/Login";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ==========================
  // PEGAR SESSÃO
  // ==========================
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser.id);
      }

      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ==========================
  // BUSCAR PROFILE
  // ==========================
  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    setProfile(data);
  }

  // ==========================
  // BLOQUEIO AUTOMÁTICO
  // ==========================
  function isBlocked() {
    if (!profile) return false;

    if (profile.blocked) return true;

    if (profile.expires_at) {
      const now = new Date();
      const expire = new Date(profile.expires_at);
      if (expire < now) return true;
    }

    return false;
  }

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

  if (!user) return <Login />;

  if (isBlocked()) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0a0a0a",
        color: "white",
        flexDirection: "column"
      }}>
        <h2>🚫 Plano Expirado ou Conta Bloqueada</h2>
        <p>Entre em contato para renovar seu acesso.</p>
      </div>
    );
  }

  return <Home profile={profile} />;
}