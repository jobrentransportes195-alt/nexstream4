import { useState } from "react";

export default function Player({ url }: { url: string }) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <button onClick={() => setOpen(false)} style={closeBtn}>X</button>
        <video
          src={url}
          controls
          autoPlay
          style={{ width: "100%", borderRadius: "8px" }}
        />
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999
};

const modal = {
  width: "80%",
  maxWidth: "900px"
};

const closeBtn = {
  background: "#e50914",
  color: "white",
  border: "none",
  padding: "5px 10px",
  cursor: "pointer",
  marginBottom: "10px"
};