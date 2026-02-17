
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 px-16 py-6 flex items-center justify-between ${isScrolled ? 'bg-black shadow-2xl py-4' : 'bg-gradient-to-b from-black via-black/50 to-transparent'}`}>
      <div className="flex items-center gap-14">
        <h1 
          className="text-4xl font-black text-red-600 tracking-tighter uppercase italic cursor-pointer hover:scale-105 transition-transform" 
          onClick={() => navigate('/')}
        >
          NexStream
        </h1>
        <nav className="hidden lg:flex items-center gap-10 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
          <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button>
          <button className="hover:text-white transition-colors">TV Ao Vivo</button>
          <button className="hover:text-white transition-colors">Filmes</button>
          <button className="hover:text-white transition-colors">Séries</button>
          <button className="hover:text-white transition-colors">Minha Lista</button>
        </nav>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative group hidden sm:block">
          <button className="text-zinc-400 hover:text-white transition-colors">
            <SearchIcon />
          </button>
        </div>
        
        <div className="flex items-center gap-4 group cursor-pointer" onClick={onLogout}>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Usuário Pro</p>
            <p className="text-[8px] font-bold text-red-600 uppercase tracking-widest">Sair da Conta</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-zinc-800 rounded-lg shadow-lg group-hover:scale-110 transition-transform flex items-center justify-center text-white font-black italic">
            N
          </div>
        </div>
      </div>
    </header>
  );
};

const SearchIcon = () => (
  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
);

export default Header;
