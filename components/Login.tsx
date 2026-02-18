import { useState } from "react";
import { supabase } from "../services/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Email ou senha incorretos");
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Entrar
      </button>
    </div>
  );
}
