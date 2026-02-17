
import { Channel } from '../types';

/**
 * Parses a raw M3U string into a structured Channel array.
 * Extracts: Name, URL, Logo, Group/Category.
 */
export const parseM3U = (content: string): Channel[] => {
  const lines = content.split('\n');
  const channels: Channel[] = [];
  let currentChannel: Partial<Channel> = {};

  // Standard regex for M3U attributes
  const regexName = /,(.*)$/;
  const regexLogo = /tvg-logo="([^"]*)"/i;
  const regexGroup = /group-title="([^"]*)"/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF:')) {
      // 1. Extract Display Name
      const nameMatch = line.match(regexName);
      if (nameMatch) currentChannel.name = nameMatch[1].trim();

      // 2. Extract Channel Logo
      const logoMatch = line.match(regexLogo);
      if (logoMatch) currentChannel.logo = logoMatch[1];

      // 3. Extract Category (Group Title)
      const groupMatch = line.match(regexGroup);
      if (groupMatch) {
        currentChannel.category = groupMatch[1];
      } else {
        // Fallback: try to infer from line content or use default
        currentChannel.category = 'Outros';
      }
    } else if (line.startsWith('http') || line.includes('rtmp://')) {
      // Line is a stream URL
      currentChannel.url = line;
      currentChannel.id = 'ch-' + Math.random().toString(36).substr(2, 9);
      
      // Validation: Only push if we have a name and a URL
      if (currentChannel.name && currentChannel.url) {
        channels.push({
          id: currentChannel.id,
          name: currentChannel.name,
          url: currentChannel.url,
          logo: currentChannel.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${currentChannel.name}`,
          category: currentChannel.category || 'Geral'
        } as Channel);
      }
      
      // Reset for next channel entry
      currentChannel = {};
    }
  }

  return channels;
};
