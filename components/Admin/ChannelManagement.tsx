
import React, { useState, useEffect } from 'react';
import { Channel } from '../../types';

interface ChannelStatus {
  [key: string]: 'pending' | 'ok' | 'error';
}

const ChannelManagement: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [statusMap, setStatusMap] = useState<ChannelStatus>({});
  const [isScanning, setIsScanning] = useState(false);

  // Carrega os canais do localStorage
  useEffect(() => {
    const loadChannels = () => {
      const saved = localStorage.getItem('nexstream_channels');
      if (saved) setChannels(JSON.parse(saved));
    };
    loadChannels();
    // Escuta mudanças de outros componentes (como o PlaylistManager)
    window.addEventListener('storage', loadChannels);
    return () => window.removeEventListener('storage', loadChannels);
  }, []);

  const saveChannels = (newChannels: Channel[]) => {
    setChannels(newChannels);
    localStorage.setItem('nexstream_channels', JSON.stringify(newChannels));
    // Notifica o resto do app que a grade mudou
    window.dispatchEvent(new Event('storage'));
  };

  // REMOÇÃO INSTANTÂNEA: Clicou, sumiu do sistema.
  const handleInstantDelete = (id: string) => {
    const updated = channels.filter(c => c.id !== id);
    saveChannels(updated);
  };

  // LIMPEZA TOTAL DA GRADE
  const clearAllChannels = () => {
    if (confirm('DESEJA APAGAR TODOS OS CANAIS? Esta ação limpará toda a sua lista personalizada e deixará o sistema vazio.')) {
      saveChannels([]);
      setStatusMap({});
    }
  };

  const checkChannelHealth = async () => {
    if (channels.length === 0) return;
    setIsScanning(true);
    
    // Testa os primeiros 20 canais para não sobrecarregar
    const toTest = channels.slice(0, 20);
    
    for (const ch of toTest) {
      try {
        const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(ch.url)}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); 
        
        const res = await fetch(proxyUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        setStatusMap(prev => ({ ...prev, [ch.id]: res.ok ? 'ok' : 'error' }));
      } catch {
        setStatusMap(prev => ({ ...prev, [ch.id]: 'error' }));
      }
    }
    setIsScanning(false);
  };

  return (
    <div className="space-y-10 animate-fadeIn max-w-7xl mx-auto pb-20 font-['Inter']">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">Minha Grade</h2>
          <p className="text-zinc-600 font-bold uppercase tracking-[0.4em] text-[10px] mt-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            {channels.length} CANAIS SINCRONIZADOS POR VOCÊ
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={checkChannelHealth}
            disabled={isScanning || channels.length === 0}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white px-8 py-5 rounded-2xl font-black transition-all flex items-center gap-3 text-[10px] tracking-widest disabled:opacity-20"
          >
            {isScanning ? (
              <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : <span>⚡</span>}
            TESTAR SINAL (TOP 20)
          </button>

          <button 
            onClick={clearAllChannels}
            disabled={channels.length === 0}
            className="bg-red-600/10 border border-red-600/20 text-red-600 hover:bg-red-600 hover:text-white px-8 py-5 rounded-2xl font-black transition-all text-[10px] tracking-widest shadow-xl shadow-red-900/10 disabled:opacity-20"
          >
            RESETAR TODA A GRADE
          </button>
        </div>
      </header>

      <div className="bg-zinc-950/40 border border-zinc-900/50 rounded-[3.5rem] overflow-hidden backdrop-blur-3xl shadow-3xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black/60 text-zinc-700 text-[10px] uppercase font-black tracking-[0.5em] border-b border-zinc-900">
            <tr>
              <th className="px-12 py-10 w-32 text-center">Ação</th>
              <th className="px-6 py-10">Canal / Fonte</th>
              <th className="px-10 py-10">Categoria</th>
              <th className="px-10 py-10">Status de Rede</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/30">
            {channels.map(channel => (
              <tr key={channel.id} className="transition-all hover:bg-zinc-900/30 group">
                <td className="px-12 py-8 text-center">
                  <button 
                    onClick={() => handleInstantDelete(channel.id)}
                    className="w-12 h-12 rounded-2xl bg-zinc-900 text-zinc-700 hover:bg-red-600 hover:text-white hover:rotate-12 transition-all flex items-center justify-center border border-zinc-800 shadow-xl active:scale-75"
                    title="Remover agora"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </td>
                <td className="px-6 py-8">
                  <div className="flex items-center gap-8">
                    <img 
                      src={channel.logo} 
                      alt="" 
                      className="w-16 h-16 object-cover rounded-3xl bg-black border border-white/5 shadow-2xl group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="max-w-md">
                       <p className="font-black text-white text-2xl italic tracking-tighter uppercase group-hover:text-red-600 transition-colors">
                        {channel.name}
                       </p>
                       <p className="text-[9px] text-zinc-700 font-bold uppercase truncate font-mono tracking-tight mt-1 opacity-40 group-hover:opacity-100 transition-opacity">
                        {channel.url}
                       </p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className="px-6 py-2 bg-black/40 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 border border-zinc-900 group-hover:border-red-600/30 group-hover:text-zinc-300 transition-all">
                    {channel.category}
                  </span>
                </td>
                <td className="px-10 py-8">
                   <div className="flex flex-col gap-2">
                      <div className={`flex items-center gap-3 font-black text-[10px] uppercase tracking-widest ${channel.useProxy ? 'text-red-600' : 'text-zinc-800'}`}>
                        <div className={`w-2 h-2 rounded-full ${channel.useProxy ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-zinc-900'}`}></div>
                        {channel.useProxy ? 'Túnel Pro Ativado' : 'Conexão Direta'}
                      </div>
                      {statusMap[channel.id] && (
                        <div className={`flex items-center gap-2 text-[9px] font-black uppercase italic ${statusMap[channel.id] === 'ok' ? 'text-green-500' : 'text-red-800'}`}>
                          {statusMap[channel.id] === 'ok' ? '✓ Sinal Identificado' : '✗ Link em Queda'}
                        </div>
                      )}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {channels.length === 0 && (
          <div className="py-52 text-center flex flex-col items-center gap-8">
            <div className="w-32 h-32 bg-zinc-900/20 rounded-[3rem] flex items-center justify-center border border-zinc-900/50 animate-pulse">
               <span className="text-6xl opacity-10">📺</span>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-black uppercase tracking-[0.6em] text-xl italic leading-none">
                Grade Vazia
              </h3>
              <p className="text-zinc-700 text-[11px] font-bold uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
                Nenhum canal selecionado ou importado. <br/> Vá em <span className="text-red-600">Importar M3U</span> para começar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelManagement;
