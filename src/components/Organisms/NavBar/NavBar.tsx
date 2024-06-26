import "./navBar.scss";
import NavBoard from "../../Molecules/NavBoard/NavBoard.tsx";
import NavBoardItem from "../../Atoms/NavBoardItem/NavBoardItem.tsx";
import ThemeChange from "../../Atoms/ThemeChange/ThemeChange.tsx";
import HideButton from "../../Atoms/HideButton/HideButton.tsx";
import { useData } from "../../../Reducers/dataContexReducer.tsx";
import { useActionDispatch } from "../../../Reducers/actionContexReducer.tsx";
import {
  useActive,
  useActiveDispatch,
} from "../../../Reducers/activeContextReducer.tsx";

type Props = {
  sidebar: boolean;
  mobileNav: boolean;
  handleHide: () => void;
  handleMobileHide: (visible: boolean) => void;
  width: number;
};

export default function NavBar({
  sidebar,
  mobileNav,
  handleHide,
  handleMobileHide,
  width,
}: Props) {
  const data = useData();
  const activeBoard = useActive();
  //Viewport width breakpoint to render sidebar / mobile navigation
  const breakpoint = 750;

  const dispatchAction = useActionDispatch();
  const dispatchActive = useActiveDispatch();

  function handleActiveBoard(boardID: string) {
    dispatchActive({ type: "change active board", boardID: boardID });
    handleMobileHide(false);
  }

  function handleCreateBoard() {
    dispatchAction({ type: "adding board" });
    handleMobileHide(false);
  }

  const Boards = data.boards?.map((board) => (
    <NavBoardItem
      onClick={() => handleActiveBoard(board.id)}
      key={board.id}
      status={board.id === activeBoard ? "active" : ""}
    >
      {board.name}
    </NavBoardItem>
  ));

  return (
    <aside
      className={
        "nav-bar" +
        ((sidebar && width > breakpoint) || (mobileNav && width <= breakpoint)
          ? ""
          : " hidden")
      }
    >
      <NavBoard boardCount={data.boards?.length || 0}>
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
