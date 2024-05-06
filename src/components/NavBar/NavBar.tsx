import "./navBar.scss";
import NavBoard from "../NavBoard/NavBoard";
import NavBoardItem from "../NavBoardItem/NavBoardItem";
import ThemeChange from "../ThemeChange/ThemeChange";
import HideButton from "../HideButton/HideButton.tsx";
import { useData } from "../../Reducers/dataContexReducer.tsx";
import { useActionDispatch } from "../../Reducers/actionContexReducer.tsx";

type Props = {
  sidebar: boolean;
  handleHide: () => void;
  activeBoard: string;
  handleActiveBoard: (boardName: string) => void;
};

export default function NavBar({
  sidebar,
  handleHide,
  activeBoard,
  handleActiveBoard,
}: Props) {
  const data = useData();

  const dispatchAction = useActionDispatch();

  function handleCreateBoard() {
    dispatchAction({ type: "adding board" });
  }

  const Boards = data.boards.map((board) => (
    <NavBoardItem
      onClick={() => handleActiveBoard(board.name)}
      key={board.name}
      status={board.name === activeBoard ? "active" : ""}
    >
      {board.name}
    </NavBoardItem>
  ));
  return (
    <aside className={"nav-bar" + (sidebar ? "" : " hidden")}>
      <NavBoard boardCount={data.boards.length}>
        {Boards}
        <NavBoardItem onClick={() => handleCreateBoard()} status={"create"}>
          + Create New Board
        </NavBoardItem>
      </NavBoard>
      <div className="nav-bar__controls">
        <ThemeChange />
        <HideButton onClick={handleHide} status={"hide"}>
          Hide Sidebar
        </HideButton>
      </div>
    </aside>
  );
}
