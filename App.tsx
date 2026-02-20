import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./services/supabase";

import Header from "./components/Header";
import Home from "./components/Home";
import MoviePage from "./components/MoviePage";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <BrowserRouter>
      <Header onLogout={handleLogout} profile={profile} />

      <Routes>
        <Route path="/" element={<Home category="Home" />} />
        <Route path="/filmes" element={<Home category="Filmes" />} />
        <Route path="/series" element={<Home category="Séries" />} />
        <Route path="/filme/:id" element={<MoviePage profile={profile} />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;