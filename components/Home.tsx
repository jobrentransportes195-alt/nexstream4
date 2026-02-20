import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Channel {
  name: string;
  url: string;
  group: string;
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
            const url = lines[i + 1];

            items.push({ name, url, group });
          }
        }

        setChannels(items);
      });
  }, []);

  const filtered = channels.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <input
        placeholder="Buscar canal..."
        className="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="grid">
        {filtered.map((ch, i) => (
          <div
            key={i}
            className="card"
            onClick={() =>
              navigate(`/player/${encodeURIComponent(ch.url)}`)
            }
          >
            <div className="channel-name">{ch.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;