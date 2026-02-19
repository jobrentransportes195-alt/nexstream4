import { useState } from "react";

export default function AdminPanel() {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    alert(`Filme ${title} adicionado (simulação)`);
  };

  return (
    <div className="page-container">
      <h2>Painel Admin</h2>

      <input
        type="text"
        placeholder="Nome do filme"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={handleAdd}>Adicionar</button>
    </div>
  );
}