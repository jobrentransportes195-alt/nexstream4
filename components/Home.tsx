import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Channel {
  name: string;
  url: string;
  group: string;
  logo?: string;
}

function Home() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
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

  const filtered = channels.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(filtered.map(c => c.group))];

  return (
    <div className="container">
      {/* 🔥 Banner Principal */}
      <div className="hero">
        <h1>TV Ao Vivo</h1>
        <p>Assista seus canais favoritos em alta qualidade</p>
      </div>

      {/* 🔍 Busca */}
      <input
        placeholder="Buscar canal..."
        className="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* 📂 Categorias */}
      {categories.map(category => (
        <div key={category}>
          <h2 className="category-title">{category}</h2>

          <div className="horizontal-scroll">
            {filtered
              .filter(c => c.group === category)
              .map((ch, i) => (
                <div
                  key={i}
                  className="card"
                  onClick={() =>
                    navigate(`/player/${encodeURIComponent(ch.url)}`)
                  }
                >
                  {ch.logo && (
                    <img
                      src={ch.logo}
                      alt={ch.name}
                      className="channel-logo"
                    />
                  )}
                  <div className="channel-name">{ch.name}</div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;