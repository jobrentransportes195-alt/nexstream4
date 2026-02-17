
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User, isAdmin: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Login via Supabase
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password) // Idealmente use auth.signInWithPassword em prod
        .single();

      if (error || !user) {
        alert('Usuário não encontrado ou senha incorreta.');
      } else {
        const userData: User = {
          id: user.id,
          name: user.name,
          username: user.username,
          createdAt: user.created_at,
          expiresAt: user.expires_at,
          isActive: user.is_active,
          credits: user.credits
        };
        onLogin(userData, user.is_admin || false);
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-black">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574375927938-d5a98e8ede83?q=80&w=2000')] bg-cover opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
      
      <div className="relative z-10 w-full max-w-md p-12 bg-black/80 rounded-3xl border border-white/10 backdrop-blur-md">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-red-600 tracking-tighter uppercase italic">NexStream</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-2">Plataforma de Transmissão Profissional</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Credenciais de Acesso</label>
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-5 bg-zinc-900/50 rounded-2xl border border-white/5 focus:border-red-600 outline-none transition-all font-bold text-white"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-5 bg-zinc-900/50 rounded-2xl border border-white/5 focus:border-red-600 outline-none transition-all font-bold text-white"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white font-black rounded-2xl transition-all shadow-2xl shadow-red-600/20 uppercase tracking-widest"
          >
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>
        
        <div className="mt-10 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
          Sua TV, Suas Regras. NexStream v7.5
        </div>
      </div>
    </div>
  );
};

export default Login;
