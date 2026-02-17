
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Channel } from '../types';

interface ChannelCardProps {
  channel: Channel;
  isFocused?: boolean;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, isFocused }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const fallbackLogo = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(channel.name)}&backgroundColor=b91c1c`;

  return (
    <div 
      onClick={() => navigate(`/player/${channel.id}`)}
      className={`
        relative flex-none w-72 aspect-video bg-zinc-900 rounded-xl cursor-pointer transition-all duration-500
        ${isFocused 
          ? 'scale-110 z-50 ring-4 ring-red-600 shadow-[0_0_50px_rgba(229,9,20,0.4)] translate-y-[-10px]' 
          : 'scale-100 hover:scale-105 opacity-80'
        }
      `}
    >
      <img 
        src={imgError ? fallbackLogo : (channel.logo || fallbackLogo)} 
        alt={channel.name} 
        onError={() => setImgError(true)}
        className="w-full h-full object-cover rounded-xl"
      />
      
      {/* Focus Overlay - Netflix Style */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-5 rounded-xl transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-3 mb-2">
           <div className="bg-red-600 p-2 rounded-full shadow-lg">
            <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
           </div>
           <p className="text-sm font-black uppercase italic tracking-tighter truncate drop-shadow-md">{channel.name}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{channel.category}</p>
          {channel.useProxy && <div className="text-[8px] bg-red-600/20 text-red-500 px-1.5 py-0.5 rounded font-black uppercase">Proxy</div>}
        </div>
      </div>

      {!isFocused && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[8px] font-black uppercase tracking-widest text-zinc-400">
           {channel.name}
        </div>
      )}
    </div>
  );
};

export default ChannelCard;
