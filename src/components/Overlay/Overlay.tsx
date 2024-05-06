import "./overlay.scss";

export default function Overlay({ onClick }: { onClick: () => void }) {
  return <div onClick={onClick} className="overlay"></div>;
}
