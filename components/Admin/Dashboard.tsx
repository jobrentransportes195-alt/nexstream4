
import React, { useMemo } from 'react';
import { User, Channel } from '../../types';

const Dashboard: React.FC = () => {
  const users: User[] = useMemo(() => {
    const saved = localStorage.getItem('nexstream_users');
    return saved ? JSON.parse(saved) : [];
  }, []);
  
  const channels: Channel[] = useMemo(() => {
    const saved = localStorage.getItem('nexstream_channels');
    return saved ? JSON.parse(saved) : [];
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    const active = users.filter(u => new Date(u.expiresAt) > now && u.isActive).length;
    const expiringToday = users.filter(u => {
      const expDate = new Date(u.expiresAt).toISOString().split('T')[0];
      return expDate === todayStr;
    }).length;

    return {
      active,
      expiringToday,
      totalChannels: channels.length,
      totalUsers: users.length
    };
  }, [users, channels]);

  return (
    <div className="space-y-10 animate-fadeIn">
      <header>
        <h2 className="text-4xl font-black tracking-tight text-white italic uppercase">Visão Geral</h2>
        <p className="text-zinc-500 font-medium">Controle de métricas e saúde do sistema NexStream Pro.</p>
      </header>

      {/* High-Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Usuários Ativos" 
          value={stats.active} 
          subtitle="Acesso liberado no sistema"
          icon={<UsersIcon />}
          color="border-green-500/40 text-green-500 shadow-green-900/10"
        />
        <StatCard 
          title="Vencem Hoje" 
          value={stats.expiringToday} 
          subtitle="Necessitam de renovação"
          icon={<ClockIcon />}
          color="border-yellow-500/40 text-yellow-500 shadow-yellow-900/10"
        />
        <StatCard 
          title="Total de Canais" 
          value={stats.totalChannels} 
          subtitle="Sincronizados via M3U"
          icon={<TvIcon />}
          color="border-red-600/40 text-red-600 shadow-red-900/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl backdrop-blur-xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
            Distribuição de Conteúdo
          </h3>
          <div className="space-y-4">
            {Array.from(new Set(channels.map(c => c.category))).slice(0, 6).map(cat => {
              const count = channels.filter(c => c.category === cat).length;
              const percentage = (count / channels.length) * 100;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-zinc-500">
                    <span>{cat}</span>
                    <span>{count} canais</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-600 rounded-full transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Help / Admin Tips */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-4">Dicas do Especialista</h3>
          <ul className="space-y-4 text-sm text-zinc-400">
            <li className="flex gap-3">
              <span className="text-red-600 font-bold">01.</span>
              Mantenha suas listas M3U sempre atualizadas para evitar links quebrados.
            </li>
            <li className="flex gap-3">
              <span className="text-red-600 font-bold">02.</span>
              Use o botão de "Banir" para usuários inadimplentes antes de excluí-los.
            </li>
            <li className="flex gap-3">
              <span className="text-red-600 font-bold">03.</span>
              Verifique os logs de sincronização caso os canais não apareçam na home.
            </li>
          </ul>
          <button className="mt-8 w-full py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold transition-all">
            Ver Logs Completos
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: number, subtitle: string, icon: React.ReactNode, color: string }> = ({ title, value, subtitle, icon, color }) => (
  <div className={`bg-zinc-900/50 border border-zinc-800 border-t-4 p-8 rounded-3xl shadow-2xl backdrop-blur-md transition-transform hover:scale-[1.02] ${color}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{title}</p>
        <p className="text-6xl font-black tracking-tighter text-white">{value}</p>
      </div>
      <div className="p-4 bg-zinc-950/50 rounded-2xl">
        {icon}
      </div>
    </div>
    <p className="text-xs font-medium opacity-50 mt-4 italic">{subtitle}</p>
  </div>
);

const UsersIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-10a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
);
const ClockIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
);
const TvIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2m10 2V2M5 8h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2z"/></svg>
);

export default Dashboard;
