import "./overlay.scss";

type Props = {
  onClick: () => void;
};

export default function Overlay({ onClick }: Props) {
  return <div onClick={onClick} className="overlay"></div>;
}
