import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [channels, setChannels] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/lista.m3u")
      .then(res => res.text())
      .then(text => {
        const lines = text.split("\n");
        const items: any[] = [];

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith("#EXTINF")) {
            const name = lines[i].split(",")[1];
            const url = lines[i + 1];
            items.push({ name, url });
          }
        }

        setChannels(items);
      });
  }, []);

  return (
    <div className="grid">
      {channels.map((ch, i) => (
        <div
          key={i}
          className="card"
          onClick={() =>
            navigate(`/player/${encodeURIComponent(ch.url)}`)
          }
        >
          {ch.name}
        </div>
      ))}
    </div>
  );
}

export default Home;