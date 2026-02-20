import { useParams } from "react-router-dom";

function Player() {
  const { url } = useParams();

  return (
    <div style={{ background: "black", height: "100vh" }}>
      <video
        src={decodeURIComponent(url!)}
        controls
        autoPlay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

export default Player;