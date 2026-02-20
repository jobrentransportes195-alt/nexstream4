import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface Channel {
  name: string;
  url: string;
  group: string;
  logo?: string;
}

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [search, setSearch] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  // ==============================
  // PARSE M3U
  // ==============================
  function parseM3U(text: string) {
    const lines = text.split("\n").map(l => l.trim());
    const items: Channel[] = [];

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("#EXTINF")) {
        const info = lines[i];
        const name = info.split(",")[1] || "Canal";
        const url = lines[i + 1];

        if (url && !url.startsWith("#")) {
          items.push({
            name,
            url,
            group: "CANAIS"
          });
        }
      }
    }

    setChannels(items);
  }

  // ==============================
  // UPLOAD POR ARQUIVO
  // ==============================
  function handleFileUpload(file: File) {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      parseM3U(text);
    };
    reader.readAsText(file);
  }

  // ==============================
  // IMPORTAR POR LINK
  // ==============================
  async function handleImportByLink() {
    if (!playlistUrl) return;

    try {
      const res = await fetch(playlistUrl);
      const text = await res.text();
      parseM3U(text);
    } catch {
      alert("Erro ao importar lista");
    }
  }

  const filtered = channels.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">

      <h1 className="title">NexStream</h1>

      {/* IMPORTAR POR LINK */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Cole o link da playlist M3U"
          value={playlistUrl}
          onChange={(e) => setPlaylistUrl(e.target.value)}
          style={{ padding: 10, width: "70%" }}
        />
        <button onClick={handleImportByLink} style={{ padding: 10 }}>
          Importar Link
        </button>
      </div>

      {/* IMPORTAR POR ARQUIVO */}
      <div style={{ marginBottom: 20 }}>
        <label style={{
          background: "linear-gradient(90deg,#ff00cc,#3333ff)",
          padding: 10,
          borderRadius: 8,
          cursor: "pointer",
          color: "white"
        }}>
          📂 Importar Arquivo M3U
          <input
            type="file"
            accept=".m3u"
            hidden
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
        </label>
      </div>

      {/* BUSCA */}
      <input
        placeholder="Buscar canal..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ padding: 10, marginBottom: 20 }}
      />

      {/* LISTA */}
      <div>
        {filtered.map((ch, i) => (
          <div
            key={i}
            style={{
              background: "#111",
              padding: 10,
              marginBottom: 10,
              borderRadius: 8,
              cursor: "pointer",
              color: "white"
            }}
            onClick={() => {
              if (videoRef.current) {
                if (Hls.isSupported()) {
                  const hls = new Hls();
                  hls.loadSource(ch.url);
                  hls.attachMedia(videoRef.current);
                } else {
                  videoRef.current.src = ch.url;
                }
              }
            }}
          >
            {ch.name}
          </div>
        ))}
      </div>

      {/* PLAYER */}
      <video
        ref={videoRef}
        controls
        style={{ width: "100%", marginTop: 20 }}
      />
    </div>
  );
}