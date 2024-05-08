import { v4 as uuidv4 } from "uuid";
import PageHeader from "./components/PageHeader/PageHeader.tsx";
import MainPage from "./components/MainPage/MainPage.tsx";
import HideButton from "./components/HideButton/HideButton.tsx";
import { useData, useDataDispatch } from "./Reducers/dataContexReducer.tsx";

import { useEffect, useState } from "react";
import AddEditTask from "./components/Forms/AddEditTask/AddEditTask.tsx";
import ViewTask from "./components/Forms/ViewTask/ViewTask.tsx";
import AddEditBoard from "./components/Forms/AddEditBoard/AddEditBoard.tsx";
import DeleteTaskBoard from "./components/Forms/DeleteTaskBoard/DeleteTaskBoard.tsx";
import {
  useAction,
  useActionDispatch,
} from "./Reducers/actionContexReducer.tsx";
import Overlay from "./components/Overlay/Overlay.tsx";
import { useActive } from "./Reducers/activeContextReducer.tsx";
import { useTask } from "./Reducers/taskContexReducer.tsx";

export default function App() {
  const data = useData();
  const action = useAction();
  const dispatchAction = useActionDispatch();
  const task = useTask();
  console.log(data.boards);

  const [sidebar, setSidebar] = useState(true);
  const activeBoard = useActive();

  const activeBoardName = data.boards?.find(
    (board) => board.id === activeBoard
  )?.name;

  const toggleSidebar = () => {
    setSidebar(!sidebar);
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && action !== "") {
        dispatchAction("");
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  return (
    <>
      <PageHeader sidebar={sidebar} />
      <MainPage sidebar={sidebar} handleHide={toggleSidebar} />
      <HideButton status="show" onClick={toggleSidebar} sidebar={sidebar} />
      {action !== "" && <Overlay onClick={() => dispatchAction("")} />}
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
    </>
  );
}
