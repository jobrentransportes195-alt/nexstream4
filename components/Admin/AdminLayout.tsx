
import React from 'react';
import { NavLink } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, onLogout }) => {
  return (
    <div className="flex h-screen bg-black overflow-hidden font-['Inter']">
      {/* Premium Sidebar */}
      <aside className="w-72 bg-zinc-950 border-r border-zinc-900 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-50">
        <div className="p-10">
          <h1 className="text-3xl font-black text-red-600 tracking-tighter uppercase italic">NexStream</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-black">Admin Pro</p>
          </div>
        </div>
        
        <nav className="flex-1 px-6 space-y-3">
          <AdminNavItem to="/admin" end>
            <DashboardIcon /> DASHBOARD
          </AdminNavItem>
          <AdminNavItem to="/admin/users">
            <UserIcon /> CLIENTES
          </AdminNavItem>
          <AdminNavItem to="/admin/channels">
            <TvIconSidebar /> GERENCIAR CANAIS
          </AdminNavItem>
          <AdminNavItem to="/admin/playlists">
            <SyncIcon /> IMPORTAR M3U
          </AdminNavItem>
        </nav>

        <div className="p-8 border-t border-zinc-900">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
          >
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Viewport */}
      <main className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black p-12 scrollbar-hide">
        {children}
      </main>
    </div>
  );
};

const AdminNavItem: React.FC<{ to: string, children: React.ReactNode, end?: boolean }> = ({ to, children, end }) => (
  <NavLink 
    to={to} 
    end={end}
    className={({ isActive }) => `
      flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-xs tracking-widest
      ${isActive 
        ? 'bg-red-600 text-white shadow-xl shadow-red-600/20 translate-x-2' 
        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 hover:translate-x-1'}
    `}
  >
    {children}
  </NavLink>
);

const DashboardIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>;
const UserIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>;
const SyncIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>;
const TvIconSidebar = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 4V2m10 2V2M5 8h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2z"/></svg>;

export default AdminLayout;
