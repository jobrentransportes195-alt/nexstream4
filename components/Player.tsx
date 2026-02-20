import { useParams } from "react-router-dom";

function Player() {
  const { url } = useParams();

  return (
    <div style={{ padding: 20 }}>
      <video
        controls
        autoPlay
        width="100%"
        src={decodeURIComponent(url!)}
      />
    </div>
  );
}

export default Player;