import { useEffect, useState } from "react";
import { supabase } from "./services/supabase";
import Home from "./components/Home";
import Login from "./components/Login";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  async function fetchProfile() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
  }

  if (loading) return <div>Carregando...</div>;

  if (!user) return <Login />;

  if (!profile?.active) {
    return (
      <div style={{ padding: 30 }}>
        <h2>Conta inativa</h2>
        <p>Entre em contato para ativar sua assinatura.</p>
      </div>
    );
  }

  return <Home />;
}