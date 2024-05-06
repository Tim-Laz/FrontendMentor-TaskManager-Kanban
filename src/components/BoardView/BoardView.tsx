import "./boardView.scss";
import { useData } from "../../Reducers/dataContexReducer";
import TaskColumn from "../TaskColumn/TaskColumn";
import Card from "../Card/Card";

type Props = {
  activeBoard: string;
};

export default function BoardView({ activeBoard }: Props) {
  const data = useData();
  const dataActiveBoard = data.boards.filter(
    (board) => board.name === activeBoard
  )[0].columns;

  const columns = dataActiveBoard.map((column) => {
    return (
      <TaskColumn
        key={column.id}
        title={column.name}
        tasksCount={column.tasks.length}
      >
        {column.tasks.map((task) => {
          return (
            <Card
              key={task.title}
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
  });
  return (
    <main className="board-view">
      {columns}
      <button className="board-view__new-column">
        <p className="board-view__text hXL">+ New Column</p>
      </button>
    </main>
  );
}
