import { useEffect, useState } from "react";

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

  const categories = [...new Set(filtered.map(c => c.group))];

  return (
    <div className="container">

      <div className="hero">
        <h1>TV Ao Vivo</h1>
        <p>Assista seus canais favoritos</p>
      </div>

      <input
        placeholder="Buscar canal..."
        className="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {categories.map(category => (
        <div key={category}>
          <h2 className="category-title">{category}</h2>

          <div className="horizontal-scroll">
            {filtered
              .filter(c => c.group === category)
              .map((ch, i) => (
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
        </div>
      ))}

      {/* PLAYER MODAL */}
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
              src={selectedChannel.url}
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