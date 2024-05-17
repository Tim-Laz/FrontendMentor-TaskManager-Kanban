import PageHeader from "./components/Organisms/PageHeader/PageHeader.tsx";
import MainPage from "./components/Templates/MainPage/MainPage.tsx";
import HideButton from "./components/Atoms/HideButton/HideButton.tsx";
import { useData } from "./Reducers/dataContexReducer.tsx";

import { useEffect, useState } from "react";
import AddEditTask from "./components/Molecules/Modals/AddEditTask/AddEditTask.tsx";
import ViewTask from "./components/Molecules/Modals/ViewTask/ViewTask.tsx";
import AddEditBoard from "./components/Molecules/Modals/AddEditBoard/AddEditBoard.tsx";
import DeleteTaskBoard from "./components/Molecules/Modals/DeleteTaskBoard/DeleteTaskBoard.tsx";
import {
  useAction,
  useActionDispatch,
} from "./Reducers/actionContexReducer.tsx";
import Overlay from "./components/Atoms/Overlay/Overlay.tsx";
import { useActive } from "./Reducers/activeContextReducer.tsx";
import { useTask } from "./Reducers/taskContexReducer.tsx";

export default function App() {
  const data = useData();
  const action = useAction();
  const dispatchAction = useActionDispatch();
  const task = useTask();
  const activeBoard = useActive();
  const activeBoardName = data.boards?.find(
    (board) => board.id === activeBoard
  )?.name;

  const [sidebar, setSidebar] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  const toggleSidebar = () => {
    setSidebar(!sidebar);
  };

  const toggleMobileNav = (visible: boolean) => {
    visible ? setMobileNav(true) : setMobileNav(false);
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileNav(false);
        if (action !== "") {
          dispatchAction({ type: "" });
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  const breakpoint = 750;

  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);

  return (
    <>
      <PageHeader
        sidebar={sidebar}
        mobileNav={mobileNav}
        handleMobileHide={toggleMobileNav}
        width={width}
      />
      <MainPage
        sidebar={sidebar}
        mobileNav={mobileNav}
        handleHide={toggleSidebar}
        handleMobileHide={toggleMobileNav}
        width={width}
      />
      <HideButton status="show" onClick={toggleSidebar} sidebar={sidebar} />
      {action !== "" && (
        <Overlay onClick={() => dispatchAction({ type: "" })} />
      )}
      {action === "adding board" && <AddEditBoard />}
      {action === "editing board" && (
        <AddEditBoard
          boardData={data.boards.filter((board) => board.id === activeBoard)[0]}
        />
      )}
      {action === "deleting board confirmation" && (
        <DeleteTaskBoard
          type="board"
          name={activeBoardName ? activeBoardName : ""}
          id={activeBoard}
        />
      )}
      {action === "adding new task" && <AddEditTask />}
      {action === "viewing task" && <ViewTask taskData={task} />}
      {action === "editing task" && <AddEditTask taskData={task} />}
      {action === "deleting task confirmation" && (
        <DeleteTaskBoard type="task" name={task.title} id={task.id} />
      )}
      {mobileNav === true && width <= breakpoint && (
        <Overlay onClick={() => toggleMobileNav(false)} />
      )}
    </>
  );
}
