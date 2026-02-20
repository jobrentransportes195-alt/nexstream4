import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "./services/supabase";

import Home from "./components/Home";
import MoviePage from "./components/MoviePage";
import AdminPanel from "./components/AdminPanel";
import Header from "./components/Header";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Mantém login persistente
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔥 Busca profile do usuário
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  async function fetchProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!error) {
      setProfile(data);
    }
  }

  // 🔥 Logout real
  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  if (loading) {
    return (
      <div style={{ color: "white", paddingTop: 120 }}>
        Carregando...
      </div>
    );
  }

  return (
    <>
      <Header onLogout={handleLogout} />

      <Routes>
        {/* 🏠 Home */}
        <Route path="/" element={<Home category="Home" />} />
        <Route path="/filmes" element={<Home category="Filmes" />} />
        <Route path="/series" element={<Home category="Séries" />} />

        {/* 🎬 Página do Filme */}
        <Route
          path="/filme/:id"
          element={<MoviePage profile={profile} />}
        />

        {/* 👑 Admin protegido */}
        <Route
          path="/admin"
          element={
            profile?.role === "admin" ? (
              <AdminPanel />
            ) : (
              <Home category="Home" />
            )
          }
        />
      </Routes>
    </>
  );
}