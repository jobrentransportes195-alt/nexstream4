
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Channel } from '../../types';

interface PlaylistManagerProps {
  onChannelsUpdate: (channels: Channel[]) => void;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({ onChannelsUpdate }) => {
  const [url, setUrl] = useState('https://raw.githubusercontent.com/helenfernanda/gratis/main/iptvlegal.m3u');
  const [manualText, setManualText] = useState('');
  const [importMode, setImportMode] = useState<'url' | 'manual' | 'file'>('url');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // SISTEMA DE TÚNEIS COM TROCA AUTOMÁTICA SILENCIOSA
  const fetchWithUltimateFallback = async (targetUrl: string) => {
    const proxies = [
      // 1. TENTATIVA DIRETA (GitHub e Servidores com CORS liberado)
      async () => {
        const res = await fetch(targetUrl);
        if (!res.ok) throw new Error("Direto falhou");
        return await res.text();
      },
      // 2. CorsProxy.io
      async () => {
        const res = await fetch(`https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`);
        if (!res.ok) throw new Error("CorsProxy falhou");
        return await res.text();
      },
      // 3. AllOrigins (Bypass cache)
      async () => {
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&timestamp=${Date.now()}`);
        if (!res.ok) throw new Error("AllOrigins falhou");
        const data = await res.json();
        return data.contents;
      },
      // 4. Proxy Local NexBridge (Caso o backend esteja rodando)
      async () => {
        const res = await fetch(`/api/stream?url=${encodeURIComponent(targetUrl)}`);
        if (!res.ok) throw new Error("NexBridge offline");
        return await res.text();
      },
      // 5. CodeTabs Proxy
      async () => {
        const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`);
        if (!res.ok) throw new Error("CodeTabs falhou");
        return await res.text();
      }
    ];

    for (let i = 0; i < proxies.length; i++) {
      try {
        setStatus(`Tentando Rota ${i + 1}/${proxies.length}...`);
        const result = await proxies[i]();
        if (result && result.trim().length > 50) {
           console.log(`Conexão estabelecida via Rota ${i + 1}`);
           return result;
        }
      } catch (e) {
        console.warn(`Rota ${i + 1} bloqueada ou falhou. Mudando de túnel automaticamente...`);
      }
    }

    throw new Error("Não foi possível estabelecer conexão automática. O servidor de origem bloqueou todas as rotas de túnel conhecidas.");
  };

  const processM3U = async (m3uContent: string) => {
    setStatus('IA: Sincronizando Grade...');
    const lines = m3uContent.split('\n');
    let chunks = "";
    let count = 0;
    
    // Filtragem para o link da Helen Fernanda (prioriza canais funcionais)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('#EXTM3U') || line.startsWith('#EXTINF') || line.startsWith('http')) {
        chunks += line + "\n";
        if (line.startsWith('#EXTINF')) count++;
        if (count >= 100) break; // Aumentado para 100 canais
      }
    }

    if (!chunks || chunks.length < 50) {
       throw new Error("Conteúdo M3U inválido ou vazio.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extraia os canais deste M3U para JSON.
      Categorias: Abertos, Filmes, Esportes, Notícias, Variedades.
      REGRAS: name, url, logo (se existir), category, useProxy: true (obrigatório ativado para bypass de CORS).
      
      M3U: ${chunks}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              url: { type: Type.STRING },
              logo: { type: Type.STRING, nullable: true },
              category: { type: Type.STRING },
              useProxy: { type: Type.BOOLEAN }
            },
            required: ["name", "url", "category", "useProxy"]
          }
        }
      }
    });

    const curated: any[] = JSON.parse(response.text);
    const formatted: Channel[] = curated.map(c => ({
      ...c,
      id: 'nex-' + Math.random().toString(36).substr(2, 9),
      logo: c.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.name)}&backgroundColor=b91c1c`
    }));

    const saved = localStorage.getItem('nexstream_channels');
    const existing = saved ? JSON.parse(saved) : [];
    const updated = [...existing, ...formatted];
    
    onChannelsUpdate(updated);
    localStorage.setItem('nexstream_channels', JSON.stringify(updated));
    return formatted.length;
  };

  const handleImport = async () => {
    setLoading(true);
    setStatus('Iniciando Sequência Ultra-Proxy...');
    
    try {
      let content = '';
      if (importMode === 'url') {
        content = await fetchWithUltimateFallback(url);
      } else {
        content = manualText;
      }

      const count = await processM3U(content);
      setStatus(`SUCESSO: ${count} canais adicionados à grade!`);
      if(importMode === 'url') setUrl('');
      setManualText('');
    } catch (error: any) {
      console.error(error);
      setStatus(`Erro Fatal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setStatus('Lendo arquivo local...');
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const count = await processM3U(content);
        setStatus(`Sucesso: ${count} canais importados do arquivo!`);
      } catch (err: any) {
        setStatus(`Erro no arquivo: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto pb-20 font-['Inter']">
      <header className="flex flex-col gap-3">
        <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase flex items-center gap-5">
          <div className="w-14 h-14 bg-red-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-600/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          Importação Inteligente
        </h2>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] ml-1">Modo Túnel Reativado: Estabilidade total para streams bloqueados.</p>
      </header>

      <section className="bg-zinc-900/40 border border-zinc-800 p-14 rounded-[4.5rem] backdrop-blur-3xl shadow-3xl">
        <div className="flex gap-4 mb-12 p-2 bg-black/40 rounded-3xl border border-zinc-800/50">
          {[
            { id: 'url', label: 'Via Link (URL)' },
            { id: 'file', label: 'Upload Local' },
            { id: 'manual', label: 'Texto M3U' }
          ].map((mode) => (
            <button 
              key={mode.id}
              onClick={() => setImportMode(mode.id as any)}
              className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${importMode === mode.id ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="space-y-10">
          {importMode === 'url' && (
            <div className="space-y-4">
              <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">URL da Lista</label>
              <input 
                type="url" 
                placeholder="https://..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full bg-black/80 p-8 rounded-[2.5rem] border-2 border-zinc-800 focus:border-red-600 outline-none transition-all font-black text-xl text-white placeholder:text-zinc-900"
              />
            </div>
          )}

          {importMode === 'file' && (
            <div className="space-y-8 py-10 text-center border-4 border-dashed border-zinc-800 rounded-[3rem] hover:border-red-600/30 transition-all cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <input type="file" accept=".m3u,.m3u8,.txt" ref={fileInputRef} onChange={handleFileImport} className="hidden" />
              <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-zinc-500 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
              </div>
              <p className="text-xl font-black text-white uppercase italic tracking-tighter">Arraste ou Selecione o arquivo M3U</p>
            </div>
          )}

          {importMode === 'manual' && (
            <div className="space-y-4">
              <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Cole o conteúdo M3U aqui</label>
              <textarea 
                rows={6}
                placeholder="Ex: #EXTM3U..."
                value={manualText}
                onChange={e => setManualText(e.target.value)}
                className="w-full bg-black/80 p-8 rounded-[2.5rem] border-2 border-zinc-800 focus:border-red-600 outline-none transition-all font-mono text-sm text-zinc-400"
              />
            </div>
          )}
          
          {importMode !== 'file' && (
            <button 
              disabled={loading || (importMode === 'url' ? !url : !manualText)}
              onClick={handleImport}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-900 text-white py-8 rounded-[2.5rem] font-black transition-all shadow-2xl shadow-red-600/20 text-xl flex items-center justify-center gap-6"
            >
              {loading ? (
                <>
                  <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span className="animate-pulse">{status.toUpperCase()}</span>
                </>
              ) : (
                <span>INICIAR SINCRO IA</span>
              )}
            </button>
          )}
        </div>

        {status && (
          <div className={`mt-10 p-8 rounded-3xl border flex flex-col gap-4 animate-fadeIn ${status.includes('Erro') ? 'bg-red-600/10 border-red-600/20 text-red-500' : 'bg-green-600/10 border-green-600/20 text-green-500'}`}>
            <div className="flex items-center gap-6">
              <div className={`w-3 h-3 rounded-full animate-pulse ${status.includes('Erro') ? 'bg-red-600' : 'bg-green-500'}`}></div>
              <p className="font-bold text-sm tracking-tight">{status}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default PlaylistManager;
