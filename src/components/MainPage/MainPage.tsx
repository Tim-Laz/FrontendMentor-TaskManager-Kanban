import NavBar from "../NavBar/NavBar";
import BoardView from "../BoardView/BoardView";
import "./mainPage.scss";

type Props = {
  sidebar: boolean;
  handleHide: () => void;
  activeBoard: string;
  handleActiveBoard: (boardName: string) => void;
};

export default function MainPage({
  sidebar,
  handleHide,
  activeBoard,
  handleActiveBoard,
}: Props) {
  return (
    <div className="main-page">
      <NavBar
        sidebar={sidebar}
        handleHide={handleHide}
        activeBoard={activeBoard}
        handleActiveBoard={handleActiveBoard}
      />
      <BoardView activeBoard={activeBoard} />
    </div>
  );
}
