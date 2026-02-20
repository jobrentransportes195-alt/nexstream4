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
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // ==============================
  // CARREGAR PLAYLIST SALVA
  // ==============================
  useEffect(() => {
    const saved = localStorage.getItem("savedPlaylist");
    if (saved) {
      parseM3U(saved);
    }
  }, []);

  // ==============================
  // PLAYER
  // ==============================
  useEffect(() => {
    if (!selectedChannel || !videoRef.current) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(selectedChannel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = selectedChannel.url;
      video.play();
    }

  }, [selectedChannel]);

  // ==============================
  // PARSE M3U
  // ==============================
  function parseM3U(text: string) {

    localStorage.setItem("savedPlaylist", text);

    const lines = text.split("\n").map(l => l.trim());
    const items: Channel[] = [];

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("#EXTINF")) {
        const name = lines[i].split(",")[1] || "Canal";
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
  // IMPORTAR ARQUIVO
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
  // IMPORTAR LINK
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

      {/* IMPORTAR LINK */}
      <div style={{ marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Cole o link da playlist"
          value={playlistUrl}
          onChange={(e) => setPlaylistUrl(e.target.value)}
        />
        <button onClick={handleImportByLink}>
          Importar Link
        </button>
      </div>

      {/* IMPORTAR ARQUIVO */}
      <div style={{ marginBottom: 20 }}>
        <label className="upload-btn">
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
      />

      {/* LISTA */}
      <div style={{ marginTop: 20 }}>
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
            onClick={() => setSelectedChannel(ch)}
          >
            {ch.name}
          </div>
        ))}
      </div>

      {/* PLAYER */}
      {selectedChannel && (
        <video
          ref={videoRef}
          controls
          style={{ width: "100%", marginTop: 20 }}
        />
      )}

    </div>
  );
}