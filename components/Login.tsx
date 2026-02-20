import { useState } from "react";
import { supabase } from "../services/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    }

    setLoading(false);
  }

  async function handleRegister() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Conta criada! Verifique seu email.");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">NexStream</h1>
        <p className="login-subtitle">Premium IPTV Experience</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <button className="register-btn" onClick={handleRegister}>
          Criar Conta
        </button>
      </div>
    </div>
  );
}