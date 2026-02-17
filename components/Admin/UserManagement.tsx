
import React, { useState, useEffect } from 'react';
import { User } from '../../types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', username: '', password: '', days: 30 });

  useEffect(() => {
    const saved = localStorage.getItem('nexstream_users');
    if (saved) setUsers(JSON.parse(saved));
  }, []);

  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('nexstream_users', JSON.stringify(newUsers));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + formData.days);

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      username: formData.username,
      password: formData.password,
      createdAt: new Date().toISOString(),
      expiresAt: expiry.toISOString(),
      isActive: true,
      credits: Math.ceil(formData.days / 30)
    };

    saveUsers([...users, newUser]);
    setShowModal(false);
    setFormData({ name: '', username: '', password: '', days: 30 });
  };

  const deleteUser = (id: string) => {
    if (confirm('ATENÇÃO: Deseja excluir este usuário permanentemente?')) {
      saveUsers(users.filter(u => u.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    const updated = users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u);
    saveUsers(updated);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tight uppercase">Gestão de Clientes</h2>
          <p className="text-zinc-500 font-medium">Controle de acessos, créditos e validade de assinaturas.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-red-600/30 flex items-center gap-3"
        >
          <span className="text-2xl">+</span> NOVO CLIENTE
        </button>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-md">
        <table className="w-full text-left">
          <thead className="bg-zinc-800/40 text-zinc-500 text-[10px] uppercase font-black tracking-[0.3em]">
            <tr>
              <th className="px-8 py-6">Login / Senha</th>
              <th className="px-8 py-6">Vencimento</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Ações Rápidas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {users.map(user => {
              const isExpired = new Date(user.expiresAt) < new Date();
              return (
                <tr key={user.id} className="hover:bg-zinc-800/20 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-lg">{user.username}</span>
                      <span className="text-xs text-zinc-500 font-mono tracking-widest">{user.password}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-zinc-300 font-bold">{new Date(user.expiresAt).toLocaleDateString()}</span>
                      <span className="text-[10px] text-zinc-600 font-black uppercase">{user.credits >= 12 ? 'Anual' : `${user.credits} Créditos`}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      isExpired ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      (user.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20')
                    }`}>
                      {isExpired ? 'Vencido' : (user.isActive ? 'Ativo' : 'Banido')}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right space-x-3">
                    <button 
                      onClick={() => toggleStatus(user.id)}
                      className={`p-3 rounded-xl transition-all ${user.isActive ? 'text-zinc-500 hover:text-yellow-500 bg-zinc-800/50' : 'text-white bg-yellow-600'}`}
                      title={user.isActive ? 'Banir Usuário' : 'Reativar Usuário'}
                    >
                      <BanIcon />
                    </button>
                    <button 
                      onClick={() => deleteUser(user.id)}
                      className="p-3 text-zinc-500 hover:text-red-600 bg-zinc-800/50 rounded-xl transition-all"
                      title="Excluir Usuário"
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-32 text-center text-zinc-700 font-black uppercase tracking-widest italic opacity-50">
            Nenhum registro encontrado.
          </div>
        )}
      </div>

      {/* Modern Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-12 w-full max-w-lg shadow-[0_0_80px_rgba(229,9,20,0.15)]">
            <h3 className="text-3xl font-black mb-1 uppercase tracking-tighter text-red-600 italic">Cadastrar Acesso</h3>
            <p className="text-zinc-500 text-sm mb-10 font-medium">Gere credenciais de acesso instantâneas.</p>
            
            <form onSubmit={handleAddUser} className="space-y-6">
              <input 
                type="text" 
                required
                placeholder="Login do Cliente"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full bg-zinc-800/50 p-5 rounded-2xl border border-zinc-700 focus:border-red-600 outline-none transition-all placeholder:text-zinc-600 font-bold"
              />
              <input 
                type="password" 
                required
                placeholder="Senha / PIN"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-zinc-800/50 p-5 rounded-2xl border border-zinc-700 focus:border-red-600 outline-none transition-all placeholder:text-zinc-600 font-bold"
              />

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Período de Acesso</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { d: 30, l: '30 Dias' },
                    { d: 60, l: '60 Dias' },
                    { d: 365, l: '1 Ano' }
                  ].map(opt => (
                    <button
                      key={opt.d}
                      type="button"
                      onClick={() => setFormData({...formData, days: opt.d})}
                      className={`py-4 rounded-2xl font-black text-xs uppercase tracking-tighter border transition-all ${formData.days === opt.d ? 'bg-red-600 border-red-600 text-white shadow-xl' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-5 rounded-2xl font-black transition-colors">CANCELAR</button>
                <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl font-black transition-all shadow-xl shadow-red-600/20">CRIAR ACESSO</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const BanIcon = () => (
  <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18.36 6.64a9 9 0 11-12.73 12.73 9 9 0 0112.73-12.73zM6 6l12 12"/></svg>
);
const TrashIcon = () => (
  <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
);

export default UserManagement;
