// import ThemeChange from "./components/ThemeChange/ThemeChange.tsx";
// import Button from "./components/Button/Button.tsx";
// import TextField from "./components/TextField/TextField.tsx";
// import Checkbox from "./components/Checkbox/Checkbox.tsx";
// import Dropdown from "./components/Select/Select.tsx";
// import NavBoardItem from "./components/NavBoardItem/NavBoardItem.tsx";
// import Card from "./components/Card/Card.tsx";
// import TaskColumn from "./components/TaskColumn/TaskColumn.tsx";
// import NavBoard from "./components/NavBoard/NavBoard.tsx";
// import NavBar from "./components/NavBar/NavBar.tsx";
import { v4 as uuidv4 } from "uuid";
import PageHeader from "./components/PageHeader/PageHeader.tsx";
import MainPage from "./components/MainPage/MainPage.tsx";
import HideButton from "./components/HideButton/HideButton.tsx";
import { useData, useDataDispatch } from "./Reducers/dataContexReducer.tsx";

import { useState, useId } from "react";
import AddEditTask from "./components/Forms/AddEditTask/AddEditTask.tsx";
import ViewTask from "./components/Forms/ViewTask/ViewTask.tsx";
import AddEditBoard from "./components/Forms/AddEditBoard/AddEditBoard.tsx";
import DeleteTaskBoard from "./components/Forms/DeleteTaskBoard/DeleteTaskBoard.tsx";
import {
  useAction,
  useActionDispatch,
} from "./Reducers/actionContexReducer.tsx";
import Overlay from "./components/Overlay/Overlay.tsx";

export default function App() {
  const data = useData();
  const action = useAction();
  const dispatchData = useDataDispatch();
  const dispatchAction = useActionDispatch();

  const [sidebar, setSidebar] = useState(true);
  const [activeBoard, setActiveBoard] = useState(data.boards[0].name);

  function handleActiveBoard(boardName: string) {
    setActiveBoard(boardName);
  }
  console.log(data.boards);
  // console.log(activeBoard);

  const toggleSidebar = () => {
    setSidebar(!sidebar);
  };

  return (
    <>
      <PageHeader sidebar={sidebar} activeBoard={activeBoard} />
      <MainPage
        sidebar={sidebar}
        handleHide={toggleSidebar}
        activeBoard={activeBoard}
        handleActiveBoard={handleActiveBoard}
      />
      <HideButton status="show" onClick={toggleSidebar} sidebar={sidebar} />
      {action !== "" && <Overlay onClick={() => dispatchAction("")} />}
      {action === "adding board" && <AddEditBoard />}
      {action === "editing board" && (
        <AddEditBoard
          boardData={
            data.boards.filter((board) => board.name === activeBoard)[0]
          }
        />
      )}
      {/* <DeleteTaskBoard type="board" name={data.boards[0].name} /> */}
      {/* <AddEditBoard /> */}

      {/* <ViewTask /> */}
      {/* <AddEditTask
        taskData={{
          title: "Testing",
          description: "Anfdasfhnldsanfglksadngklsadngkladsnglnadskgads",
          subtasks: ["uhm", "guys", "cocka", "123", "uuh", "123"],
        }}
      /> */}
      {/* <ThemeChange />
      <Button type="primary-L">Test</Button>
      <TextField error={false} placeholder="Test" />
      <Checkbox>Test</Checkbox>
      <Dropdown statuses={["Todo", "Doing", "Done"]}>Test</Dropdown>
      <NavBoardItem status={""}>Testing three</NavBoardItem>
      <Card allSubtasks={2} completedSubtasks={1}>
        Testing one two three
      </Card>
      <TaskColumn title="TODO" tasksCount={2}>
        {" "}
        <Card allSubtasks={2} completedSubtasks={1}>
          Testing one two three
        </Card>{" "}
        <Card allSubtasks={2} completedSubtasks={1}>
          Testing one two three
        </Card>
      </TaskColumn>
      <PageHeader />
      <NavBoard boardCount={3}>
        <NavBoardItem status={"active"}>Testing three</NavBoardItem>
        <NavBoardItem>Testing three</NavBoardItem>
        <NavBoardItem>Testing three</NavBoardItem>
        <NavBoardItem status={"create"}>Testing three</NavBoardItem>
      </NavBoard>
      <NavBar /> */}
    </>
  );
}
