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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
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

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  return (
    <>
      <Header onLogout={handleLogout} profile={profile} />

      <Routes>
        <Route path="/" element={<Home category="Home" />} />
        <Route path="/filmes" element={<Home category="Filmes" />} />
        <Route path="/series" element={<Home category="Séries" />} />
        <Route path="/filme/:id" element={<MoviePage profile={profile} />} />
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