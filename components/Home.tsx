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

            const logoMatch = info.match(/tvg-logo="(.*?)"/);
            const logo = logoMatch ? logoMatch[1] : undefined;

            const url = lines[i + 1];

            items.push({ name, url, group, logo });
          }
        }

        setChannels(items);
      });
  }, []);

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

  return (
    <div className="premium-container">

      <header className="premium-header">
        <h1>NexStream</h1>
      </header>

      {!selectedCategory ? (
        <div className="premium-grid">
          {categories.map(cat => (
            <div
              key={cat}
              className="premium-card"
              onClick={() => setSelectedCategory(cat)}
            >
              <div className="card-overlay">
                <h2>{cat}</h2>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <button className="back-btn" onClick={() => setSelectedCategory(null)}>
            ← Voltar
          </button>

          <div className="channel-grid">
            {channels
              .filter(c => c.group === selectedCategory)
              .map((ch, i) => (
                <div
                  key={i}
                  className="channel-card"
                  onClick={() => setSelectedChannel(ch)}
                >
                  {ch.logo && <img src={ch.logo} alt={ch.name} />}
                  <span>{ch.name}</span>
                </div>
              ))}
          </div>
        </>
      )}

      {selectedChannel && (
        <div className="player-fullscreen">
          <button className="close-player" onClick={() => setSelectedChannel(null)}>✖</button>
          <video ref={videoRef} controls autoPlay />
        </div>
      )}

    </div>
  );
}

export default Home;