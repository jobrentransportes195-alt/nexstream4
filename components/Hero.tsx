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
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "fav">("all");

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const savedFav = localStorage.getItem("favorites");
    if (savedFav) setFavorites(JSON.parse(savedFav));

    fetch("/lista.m3u")
      .then(res => res.text())
      .then(text => {
        const lines = text.split("\n");
        const items: Channel[] = [];

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith("#EXTINF")) {
            const info = lines[i];
            const name = info.split(",")[1];

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

  function toggleFavorite(url: string) {
    let updated;

    if (favorites.includes(url)) {
      updated = favorites.filter(f => f !== url);
    } else {
      updated = [...favorites, url];
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  }

  const filtered = channels.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayChannels =
    activeTab === "fav"
      ? filtered.filter(c => favorites.includes(c.url))
      : filtered;

  return (
    <div className="container">

      <div className="hero">
        <h1>NexStream</h1>
        <p>IPTV Premium Experience</p>
      </div>

      {/* Abas */}
      <div className="tabs">
        <button
          className={activeTab === "all" ? "active" : ""}
          onClick={() => setActiveTab("all")}
        >
          Todos
        </button>
        <button
          className={activeTab === "fav" ? "active" : ""}
          onClick={() => setActiveTab("fav")}
        >
          Favoritos
        </button>
      </div>

      <input
        placeholder="Buscar canal..."
        className="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="grid">
        {displayChannels.map((ch, i) => (
          <div key={i} className="card">

            {ch.logo && (
              <img
                src={ch.logo}
                alt={ch.name}
                className="channel-logo"
                onClick={() => setSelectedChannel(ch)}
              />
            )}

            <div className="channel-name">{ch.name}</div>

            <button
              className="fav-btn"
              onClick={() => toggleFavorite(ch.url)}
            >
              {favorites.includes(ch.url) ? "❤️" : "🤍"}
            </button>

          </div>
        ))}
      </div>

      {selectedChannel && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setSelectedChannel(null)}
            >
              ✖
            </button>

            <video
              ref={videoRef}
              controls
              autoPlay
              style={{ width: "100%", borderRadius: "15px" }}
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;