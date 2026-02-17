
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
import { Channel } from '../types';

interface PlayerProps {
  channels: Channel[];
}

const Player: React.FC<PlayerProps> = ({ channels }) => {
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  const [channel, setChannel] = useState<Channel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [useTunnel, setUseTunnel] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [stats, setStats] = useState({ bw: 0, lat: 0 });

  useEffect(() => {
    const found = channels.find(c => c.id === channelId);
    if (found) {
      setChannel(found);
      // Ativa túnel preventivo para fontes IPTV conhecidas
      if (found.url.includes('vipketseyket') || found.url.includes('8080') || found.url.includes('streamlock')) {
        setUseTunnel(true);
      }
    } else {
      navigate('/');
    }
  }, [channelId, channels, navigate]);

  const initPlayer = () => {
    if (!channel || !videoRef.current) return;

    if (hlsRef.current) hlsRef.current.destroy();

    const hls = new Hls({
      enableWorker: true,
      maxBufferLength: 30,
      maxMaxBufferLength: 60,
      manifestLoadingMaxRetry: 10,
      levelLoadingMaxRetry: 10,
      fragLoadingMaxRetry: 10,
      startLevel: -1,
      // Otimização para Live Streams (evita o atraso do buffer)
      liveSyncDurationCount: 3,
      liveMaxLatencyDurationCount: 10,
    });

    hlsRef.current = hls;

    let finalUrl = channel.url;
    if (useTunnel) {
      finalUrl = `/api/tunnel?url=${encodeURIComponent(channel.url)}&token=${Math.random().toString(36).substring(7)}`;
    }

    console.log(`[NexPlayer] Modo: ${useTunnel ? 'TUNNEL' : 'DIRECT'} | URL: ${finalUrl}`);

    if (Hls.isSupported()) {
      hls.loadSource(finalUrl);
      hls.attachMedia(videoRef.current);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        setError(null);
        videoRef.current?.play().catch(() => {});
      });

      hls.on(Hls.Events.FRAG_BUFFERED, (event, data) => {
        setStats({
          bw: Math.round(hls.bandwidthEstimate / 1024 / 1024),
          lat: Math.round(data.stats.loading.end - data.stats.loading.start)
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error('[NexPlayer Fatal]', data);
          
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            if (!useTunnel) {
              setUseTunnel(true); // Tenta o túnel se a conexão direta falhar
            } else if (retryCount < 3) {
              setRetryCount(prev => prev + 1);
            } else {
              setError("Sinal Indisponível. O servidor de origem pode estar offline ou o túnel foi bloqueado pelo provedor.");
              setLoading(false);
            }
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            setError("Erro crítico de decodificação de vídeo.");
            setLoading(false);
          }
        }
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = finalUrl;
      videoRef.current.oncanplay = () => setLoading(false);
      videoRef.current.onerror = () => {
        if (!useTunnel) setUseTunnel(true);
        else setError("Navegador não suporta este formato de vídeo.");
      };
    }
  };

  useEffect(() => {
    initPlayer();
    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [channel, useTunnel, retryCount]);

  if (!channel) return null;

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden group">
      {(loading || error) && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black p-12">
          {error ? (
            <div className="text-center space-y-8 animate-slideUp">
              <div className="text-red-600 mb-4 scale-150">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <h1 className="text-white font-black text-6xl italic uppercase tracking-tighter">Erro de Sinal</h1>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs max-w-md mx-auto leading-relaxed">{error}</p>
              
              <div className="flex gap-4 justify-center pt-8">
                <button onClick={() => { setLoading(true); setRetryCount(0); initPlayer(); }} className="px-12 py-5 bg-white text-black rounded-full font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all">Reconectar</button>
                <button onClick={() => navigate('/')} className="px-12 py-5 bg-zinc-900 text-white rounded-full font-black uppercase text-xs tracking-widest hover:bg-zinc-800 transition-all">Sair</button>
              </div>
            </div>
          ) : (
            <div className="space-y-12 text-center">
              <div className="w-28 h-28 border-[10px] border-zinc-900 border-t-red-600 rounded-full animate-spin mx-auto shadow-[0_0_80px_rgba(229,9,20,0.2)]"></div>
              <div className="space-y-4">
                <p className="text-white font-black uppercase tracking-[0.6em] text-[10px] animate-pulse">Sintonizando Fluxo Digital</p>
                <div className="px-6 py-2 bg-red-600/10 border border-red-600/20 rounded-full inline-block">
                  <span className="text-[9px] text-red-600 font-black uppercase tracking-widest italic flex items-center gap-3">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                    {useTunnel ? 'Ghost Protocol 7.0 (Active Bypass)' : 'Conexão Direta (Standard)'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <video ref={videoRef} className="w-full h-full object-contain cursor-none" poster={channel.logo} autoPlay playsInline />
      
      {/* Overlay de Status */}
      <div className="absolute top-12 left-12 right-12 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <button onClick={() => navigate('/')} className="pointer-events-auto flex items-center gap-4 text-white group">
          <div className="p-4 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl group-hover:bg-red-600 transition-all">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </div>
          <span className="font-black uppercase tracking-widest text-[10px] italic">Voltar para Grade</span>
        </button>

        <div className="flex gap-4">
           <div className="px-6 py-3 bg-black/60 border border-white/5 rounded-2xl backdrop-blur-md flex flex-col items-end">
              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Status do Sinal</p>
              <p className="text-xs font-black text-white italic">{stats.bw} Mbps / {stats.lat}ms</p>
           </div>
           <div className={`px-6 py-3 ${useTunnel ? 'bg-red-600/20 border-red-600/30' : 'bg-green-600/20 border-green-600/30'} border rounded-2xl backdrop-blur-md flex flex-col items-end`}>
              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Protocolo</p>
              <p className={`text-xs font-black italic ${useTunnel ? 'text-red-600' : 'text-green-500'}`}>{useTunnel ? 'NEX-GHOST' : 'DIRECT-IP'}</p>
           </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
         <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase drop-shadow-2xl">{channel.name}</h2>
         <p className="text-sm text-zinc-400 font-bold uppercase tracking-[0.4em] mt-2 italic">{channel.category} // Live Stream</p>
      </div>
    </div>
  );
};

export default Player;
