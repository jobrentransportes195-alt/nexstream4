import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./services/supabase";

import Login from "./components/Login";
import Home from "./components/Home";

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica sessão atual
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    checkSession();

    // Escuta mudanças de login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={session ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/home"
          element={session ? <Home /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;