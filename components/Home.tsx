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
  const [lastChannel, setLastChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(false);
  const [miniPlayer, setMiniPlayer] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // 🔹 Carregar favoritos + último canal + lista
  useEffect(() => {
    const savedFav = localStorage.getItem("favorites");
    if (savedFav) setFavorites(JSON.parse(savedFav));

    const savedLast = localStorage.getItem("lastChannel");
    if (savedLast) setLastChannel(JSON.parse(savedLast));

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

  // 🔹 Player HLS
  useEffect(() => {
    if (selectedChannel && videoRef.current) {
      const video = videoRef.current;
      setLoading(true);

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(selectedChannel.url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
          setLoading(false);
        });
      } else {
        video.src = selectedChannel.url;
        video.onloadeddata = () => setLoading(false);
      }

      localStorage.setItem("lastChannel", JSON.stringify(selectedChannel));
      setLastChannel(selectedChannel);
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

  const groups = [...new Set(filtered.map(c => c.group))];

  return (
    <div className="container">

      {/* ===== BANNER ===== */}
      <div className="banner">
        <div className="banner-content">
          <h1>NexStream</h1>
          <p>IPTV Premium Experience</p>

          {lastChannel && (
            <button
              className="play-banner-btn"
              onClick={() => setSelectedChannel(lastChannel)}
            >
              ▶ Continuar Assistindo
            </button>
          )}
        </div>
      </div>

      {/* ===== BUSCA ===== */}
      <input
        placeholder="Buscar canal..."
        className="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* ===== FAVORITOS ===== */}
      {favorites.length > 0 && (
        <>
          <h2 className="category-title">❤️ Meus Favoritos</h2>
          <div className="horizontal-scroll">
            {channels
              .filter(c => favorites.includes(c.url))
              .map((ch, i) => (
                <div
                  key={i}
                  className={`channel-card ${
                    selectedChannel?.url === ch.url ? "active-channel" : ""
                  }`}
                >
                  <div
                    className="card-image"
                    onClick={() => setSelectedChannel(ch)}
                  >
                    <div className="live-badge">AO VIVO</div>

                    {ch.logo && (
                      <img src={ch.logo} alt={ch.name} />
                    )}

                    <div className="overlay-play">▶</div>
                  </div>

                  <p>{ch.name}</p>

                  <button
                    className="fav-btn"
                    onClick={() => toggleFavorite(ch.url)}
                  >
                    ❤️
                  </button>
                </div>
              ))}
          </div>
        </>
      )}

      {/* ===== CATEGORIAS ===== */}
      {groups.map(group => (
        <div key={group}>
          <h2 className="category-title">{group}</h2>

          <div className="horizontal-scroll">
            {filtered
              .filter(c => c.group === group)
              .map((ch, i) => (
                <div
                  key={i}
                  className={`channel-card ${
                    selectedChannel?.url === ch.url ? "active-channel" : ""
                  }`}
                >
                  <div
                    className="card-image"
                    onClick={() => setSelectedChannel(ch)}
                  >
                    <div className="live-badge">AO VIVO</div>

                    {ch.logo && (
                      <img src={ch.logo} alt={ch.name} />
                    )}

                    <div className="overlay-play">▶</div>
                  </div>

                  <p>{ch.name}</p>

                  <button
                    className="fav-btn"
                    onClick={() => toggleFavorite(ch.url)}
                  >
                    {favorites.includes(ch.url) ? "❤️" : "🤍"}
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* ===== MODAL PLAYER ===== */}
      {selectedChannel && (
        <div className="modal fade-in">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => {
                setSelectedChannel(null);
                setMiniPlayer(true);
              }}
            >
              ✖
            </button>

            {loading && <div className="loader"></div>}

            <video
              ref={videoRef}
              controls
              style={{ width: "100%", borderRadius: "15px" }}
            />
          </div>
        </div>
      )}

      {/* ===== MINI PLAYER ===== */}
      {miniPlayer && lastChannel && (
        <div
          className="mini-player"
          onClick={() => {
            setSelectedChannel(lastChannel);
            setMiniPlayer(false);
          }}
        >
          <video
            src={lastChannel.url}
            autoPlay
            muted
          />
        </div>
      )}

    </div>
  );
}

export default Home;