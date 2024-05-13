import "./boardView.scss";
import { useData } from "../../Reducers/dataContexReducer";
import TaskColumn from "../TaskColumn/TaskColumn";
import Card from "../Card/Card";
import { useActive } from "../../Reducers/activeContextReducer";
import { useActionDispatch } from "../../Reducers/actionContexReducer";
import Button from "../Button/Button";
import { createPortal } from "react-dom";
import ViewTask from "../Forms/ViewTask/ViewTask";
import { useTaskDispatch } from "../../Reducers/taskContexReducer";

// type Props = {};

export default function BoardView() {
  const data = useData();
  const activeBoard = useActive();
  const dataActiveBoard = data.boards?.filter(
    (board) => board.id === activeBoard
  )[0]?.columns;
  const dispatchAction = useActionDispatch();
  const dispatchTask = useTaskDispatch();
  const colors = [
    "#49C4E5",
    "#8471F2",
    "#67E2AE",
    "#74D1EA",
    "#A8DAB5",
    "#DCECCB",
    "#F2E9E2",
    "#F7CAC9",
    "#92A8D1",
    "#88B04B",
  ];

  type Task = {
    id: string;
    title: string;
    description: string;
    status: string;
    subtasks: { id: string; title: string; isCompleted: boolean }[];
  };

  function handleCardClick(task: Task, columnID: string) {
    dispatchTask({
      type: "set task",
      taskData: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        columnID: columnID,
        subtasks: task.subtasks,
      },
    });
    dispatchAction({
      type: "viewing task",
    });
  }

  function handleNewColumn() {
    dispatchAction({
      type: "editing board",
    });
  }

  const columns =
    dataActiveBoard?.map((column, i) => {
      return (
        <TaskColumn
          key={column.id}
          color={i < 10 ? colors[i] : colors[i % 10]}
          title={column.name}
          tasksCount={column.tasks.length}
        >
          {column.tasks.map((task) => {
            return (
              <Card
                onClick={() => handleCardClick(task, column.id)}
                key={task.id}
                allSubtasks={task.subtasks.length}
                completedSubtasks={
                  task.subtasks.filter((subtask) => subtask.isCompleted).length
                }
              >
                {task.title}
              </Card>
            );
          })}
        </TaskColumn>
      );
    }) || [];
  return (
    <main className="board-view">
      {columns.length > 0 ? (
        <>
          {columns}
          <button onClick={handleNewColumn} className="board-view__new-column">
            <p className="board-view__text hXL">+ New Column</p>
          </button>
        </>
      ) : (
        <div className="board-view__empty-board">
          <p className="board-view__text hL">
            {data.boards.length > 0
              ? "This board is empty. Create a new column to get started."
              : "You don't have any boards yet. Create a new board to get started."}
          </p>
          <div className="board-view__btn-container">
            <Button onClick={handleNewColumn} type="primary-L">
              {data.boards.length > 0 ? "+ Add New Column" : "+ Add New Board"}
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
