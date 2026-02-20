import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    setUsers(data || []);
  }

  async function updatePlan(id: string, plan: string, months: number) {
    const expire = new Date();
    expire.setMonth(expire.getMonth() + months);

    await supabase
      .from("profiles")
      .update({
        plan,
        expires_at: expire,
        blocked: false
      })
      .eq("id", id);

    fetchUsers();
  }

  async function blockUser(id: string) {
    await supabase
      .from("profiles")
      .update({ blocked: true })
      .eq("id", id);

    fetchUsers();
  }

  async function unblockUser(id: string) {
    await supabase
      .from("profiles")
      .update({ blocked: false })
      .eq("id", id);

    fetchUsers();
  }

  async function deleteUser(id: string) {
    await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    fetchUsers();
  }

  return (
    <div style={{ padding: 30, background: "#0f172a", minHeight: "100vh", color: "white" }}>
      <h1>👑 Painel Admin</h1>

      {users.map(user => (
        <div key={user.id} style={{
          background: "#111827",
          padding: 15,
          marginBottom: 15,
          borderRadius: 10
        }}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Plano:</strong> {user.plan}</p>
          <p><strong>Expira:</strong> {user.expires_at || "Sem data"}</p>
          <p><strong>Bloqueado:</strong> {user.blocked ? "Sim" : "Não"}</p>

          <div style={{ marginTop: 10 }}>
            <button onClick={() => updatePlan(user.id, "mensal", 1)}>Mensal</button>
            <button onClick={() => updatePlan(user.id, "trimestral", 3)}>Trimestral</button>
            <button onClick={() => updatePlan(user.id, "anual", 12)}>Anual</button>
          </div>

          <div style={{ marginTop: 10 }}>
            <button onClick={() => blockUser(user.id)}>Bloquear</button>
            <button onClick={() => unblockUser(user.id)}>Desbloquear</button>
            <button onClick={() => deleteUser(user.id)}>Excluir</button>
          </div>
        </div>
      ))}
    </div>
  );
}