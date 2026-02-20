import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface Channel {
  name: string;
  url: string;
  group: string;
  logo?: string;
}

function Home() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* ================= PLAYLIST LOAD ================= */

  useEffect(() => {
    fetch("/lista.m3u")
      .then(res => res.text())
      .then(text => {
        const lines = text.split("\n");
        const items: Channel[] = [];

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith("#EXTINF")) {
            const info = lines[i];
            const name = info.split(",")[1] || "Canal";

            const groupMatch = info.match(/group-title="(.*?)"/);
            const group = groupMatch ? groupMatch[1] : "Outros";

            const url = lines[i + 1];

            items.push({ name, url, group });
          }
        }

        setChannels(items);
      });
  }, []);

  /* ================= PLAYER ================= */

  useEffect(() => {
    if (selectedChannel && videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(selectedChannel.url);
        hls.attachMedia(video);
      } else {
        video.src = selectedChannel.url;
      }
    }
  }, [selectedChannel]);

  const categories = [...new Set(channels.map(c => c.group))];

  /* ================= UI ================= */

  if (!selectedCategory) {
    return (
      <div className="smart-container">

        <h1 className="smart-title">NexStream</h1>

        <div className="smart-grid">
          {categories.map(cat => (
            <div
              key={cat}
              className="smart-card"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>

      </div>
    );
  }

  return (
    <div className="smart-container">

      <button
        className="back-btn"
        onClick={() => setSelectedCategory(null)}
      >
        ← Voltar
      </button>

      <h2 className="category-title">{selectedCategory}</h2>

      <div className="channel-grid">
        {channels
          .filter(c => c.group === selectedCategory)
          .map((ch, i) => (
            <div
              key={i}
              className="channel-card"
              onClick={() => setSelectedChannel(ch)}
            >
              {ch.name}
            </div>
          ))}
      </div>

      {selectedChannel && (
        <div className="player-modal">
          <video
            ref={videoRef}
            controls
            autoPlay
          />
        </div>
      )}

    </div>
  );
}

export default Home;