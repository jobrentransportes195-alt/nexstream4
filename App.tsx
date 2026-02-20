import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./services/supabase";

import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import Player from "./components/Player";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  if (!user) return <Login onLogin={setUser} />;

  return (
    <>
      <Header onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player/:url" element={<Player />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </>
  );
}

export default App;