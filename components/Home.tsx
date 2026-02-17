
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Channel } from '../types';
import NetflixRow from './NetflixRow';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  channels: Channel[];
  onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ channels, onLogout }) => {
  const navigate = useNavigate();
  const [focusCoords, setFocusCoords] = useState({ row: 0, col: 0 });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const rowRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const categories = useMemo(() => 
    Array.from(new Set(channels.map(c => c.category || 'Geral'))).sort(),
    [channels]
  );

  const channelsByCategory = useMemo(() => 
    categories.map(cat => channels.filter(c => (c.category || 'Geral') === cat)),
    [categories, channels]
  );

  const scrollToCategory = (cat: string) => {
    setActiveCategory(cat);
    rowRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (channels.length === 0) return;

    switch (e.key) {
      case 'ArrowRight':
        setFocusCoords(prev => ({
          ...prev,
          col: Math.min(prev.col + 1, channelsByCategory[prev.row].length - 1)
        }));
        break;
      case 'ArrowLeft':
        setFocusCoords(prev => ({
          ...prev,
          col: Math.max(prev.col - 1, 0)
        }));
        break;
      case 'ArrowDown':
        setFocusCoords(prev => {
          const nextRow = Math.min(prev.row + 1, categories.length - 1);
          return {
            row: nextRow,
            col: Math.min(prev.col, channelsByCategory[nextRow].length - 1)
          };
        });
        break;
      case 'ArrowUp':
        setFocusCoords(prev => {
          const nextRow = Math.max(prev.row - 1, 0);
          return {
            row: nextRow,
            col: Math.min(prev.col, channelsByCategory[nextRow].length - 1)
          };
        });
        break;
      case 'Enter':
        const focusedChannel = channelsByCategory[focusCoords.row][focusCoords.col];
        if (focusedChannel) {
          navigate(`/player/${focusedChannel.id}`);
        }
        break;
      default:
        break;
    }
  }, [channels, categories, channelsByCategory, focusCoords, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Atualiza a categoria ativa baseada no scroll
  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory(categories[focusCoords.row]);
    }
  }, [focusCoords.row, categories]);

  const featured = channels.length > 0 ? channels[0] : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onLogout={onLogout} />
      
      {/* Hero Billboard */}
      {featured ? (
        <div className="relative h-[85vh] w-full flex items-center px-16 overflow-hidden">
          <img 
            src={featured.logo} 
            alt={featured.name}
            className="absolute inset-0 w-full h-full object-cover brightness-[0.25] scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          
          <div className="relative z-10 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-red-600 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">Live</span>
              <span className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px]">{featured.category}</span>
            </div>
            <h1 className="text-8xl font-black mb-6 tracking-tighter uppercase italic drop-shadow-2xl">{featured.name}</h1>
            <p className="text-2xl mb-10 text-zinc-300 font-medium max-w-2xl leading-relaxed">
              Assista agora ao melhor do entretenimento em alta definição. Navegue pelas categorias abaixo para explorar sua grade completa.
            </p>
            <div className="flex gap-6">
              <button 
                onClick={() => navigate(`/player/${featured.id}`)}
                className="flex items-center gap-3 px-12 py-5 bg-white text-black font-black rounded-xl hover:scale-105 transition-all text-lg"
              >
                 <PlayIcon /> ASSISTIR AGORA
              </button>
              <button className="flex items-center gap-3 px-12 py-5 bg-zinc-800/80 text-white font-black rounded-xl hover:bg-zinc-700 transition-all text-lg backdrop-blur-md">
                 <InfoIcon /> MAIS INFORMAÇÕES
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[80vh] flex flex-col items-center justify-center text-zinc-700 gap-6">
          <div className="w-20 h-20 border-4 border-zinc-900 border-t-red-600 rounded-full animate-spin"></div>
          <p className="font-black uppercase tracking-widest text-sm italic">Aguardando Sincronização de Lista...</p>
        </div>
      )}

      {/* Category Navigation Bar */}
      {categories.length > 0 && (
        <div className="sticky top-20 z-40 bg-gradient-to-b from-black via-black to-transparent px-16 py-6 transition-all duration-500">
          <div className="flex gap-8 overflow-x-auto scrollbar-hide no-scrollbar items-center">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mr-4">Categorias:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className={`text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'text-red-600 scale-110' : 'text-zinc-500 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Categories Rows */}
      <div className="relative -mt-20 z-20 pb-32 pl-16 space-y-24">
        {categories.map((cat, rowIndex) => (
          /* FIX: Explicitly returning void in ref callback to satisfy TypeScript requirements */
          <div key={cat} ref={el => { rowRefs.current[cat] = el; }}>
            <NetflixRow 
              title={cat} 
              channels={channelsByCategory[rowIndex]}
              isRowFocused={focusCoords.row === rowIndex}
              focusedColIndex={focusCoords.col}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const PlayIcon = () => (
  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M7 6v12l10-6z"/></svg>
);

const InfoIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
);

export default Home;
