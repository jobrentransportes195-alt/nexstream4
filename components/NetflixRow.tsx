
import React, { useRef, useEffect, useMemo } from 'react';
import { Channel } from '../types';
import ChannelCard from './ChannelCard';

interface NetflixRowProps {
  title: string;
  channels: Channel[];
  isRowFocused: boolean;
  focusedColIndex: number;
}

const NetflixRow: React.FC<NetflixRowProps> = ({ title, channels, isRowFocused, focusedColIndex }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRowFocused && rowRef.current) {
      const row = rowRef.current;
      const focusedElement = row.children[focusedColIndex] as HTMLElement;
      
      if (focusedElement) {
        const rowWidth = row.offsetWidth;
        const elementOffset = focusedElement.offsetLeft;
        const elementWidth = focusedElement.offsetWidth;
        
        // Centraliza o elemento focado para facilitar navegação via TV
        const scrollPosition = elementOffset - (rowWidth / 2) + (elementWidth / 2);
        
        row.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [isRowFocused, focusedColIndex]);

  return (
    <div className={`space-y-4 transition-all duration-700 ${isRowFocused ? 'scale-[1.01] z-30' : 'opacity-50 grayscale-[0.4]'}`}>
      <div className="flex items-center gap-6">
        <div className={`h-10 w-1.5 rounded-full transition-colors duration-500 ${isRowFocused ? 'bg-red-600' : 'bg-zinc-800'}`}></div>
        <div className="flex items-baseline gap-4">
          <h2 className={`text-4xl font-black italic tracking-tighter uppercase leading-none transition-all duration-500 ${isRowFocused ? 'text-white' : 'text-zinc-600'}`}>
            {title}
          </h2>
          <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">
            {channels.length} {channels.length === 1 ? 'canal' : 'canais'}
          </span>
        </div>
      </div>
      
      <div 
        ref={rowRef}
        className="flex gap-6 overflow-x-hidden py-8 px-4 -mx-4 scroll-smooth"
      >
        {channels.map((channel, colIndex) => (
          <ChannelCard 
            key={channel.id} 
            channel={channel} 
            isFocused={isRowFocused && focusedColIndex === colIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default NetflixRow;
