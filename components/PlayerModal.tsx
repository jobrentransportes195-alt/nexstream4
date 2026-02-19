export default function PlayerModal({ url, onClose }: any) {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={onClose}>X</button>
        <video src={url} controls autoPlay />
      </div>
    </div>
  );
}