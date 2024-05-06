import "./navBoard.scss";

type Props = {
  children: React.ReactNode;
  boardCount: number;
};

export default function NavBoard({ children, boardCount }: Props) {
  return (
    <div className="nav-board">
      <p className="nav-board__title hS">
        {"ALL BOARDS " + "(" + boardCount + ")"}
      </p>
      <div className="nav-board__items">{children}</div>
    </div>
  );
}
