import { useState } from "react";
import { supabase } from "../services/supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
  }

  async function handleRegister() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) alert(error.message);
    else alert("Conta criada! Verifique seu email.");
  }

  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <h1>NexStream Login</h1>

      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
        style={{ display: "block", margin: "10px auto", padding: 10 }}
      />

      <input
        placeholder="Senha"
        type="password"
        onChange={e => setPassword(e.target.value)}
        style={{ display: "block", margin: "10px auto", padding: 10 }}
      />

      <button onClick={handleLogin}>Entrar</button>
      <button onClick={handleRegister}>Criar Conta</button>
    </div>
  );
}

export default Login;