import Checkbox from "../../Checkbox/Checkbox";
import Select from "../../Select/Select";
import "./viewTask.scss";
import { useData, useDataDispatch } from "../../../Reducers/dataContexReducer";
import { useActive } from "../../../Reducers/activeContextReducer";
import { useTaskDispatch } from "../../../Reducers/taskContexReducer";

type Props = {
  taskData: {
    id: string;
    title: string;
    description: string;
    status: string;
    columnID: string;
    subtasks: { id: string; title: string; isCompleted: boolean }[];
  };
};

export default function ViewTask({ taskData }: Props) {
  // const subtaskIDs = taskData.subtasks.reduce((acc, subtask) => {
  //   acc.push(subtask.id);
  //   return acc;
  // }, []);
  // const subtaskTitles = taskData.subtasks.reduce((acc, subtask) => {
  //   acc.push(subtask.title);
  //   return acc;
  // }, []);

  const activeBoard = useActive();
  const data = useData();
  const dispatchData = useDataDispatch();
  const dispatchTask = useTaskDispatch();
  const activeBoardIndex = data.boards.findIndex(
    (board) => board.id === activeBoard
  );
  const columnsInfo = data.boards[activeBoardIndex].columns.reduce(
    (acc, column) => {
      acc.optionID.push(column.id);
      acc.optionName.push(column.name);
      return acc;
    },
    { optionID: [], optionName: [] }
  );

  const activeColumnIndex = columnsInfo.optionID.findIndex(
    (option) => option === taskData.columnID
  );

  function handleSubtaskCheck(subtaskID: string, completed: boolean) {
    dispatchData({
      type: "check subtask",
      activeBoard: activeBoard,
      columnID: taskData.columnID,
      taskID: taskData.id,
      subtaskID: subtaskID,
    });
    dispatchTask({
      type: "check subtask",
      subtaskID: subtaskID,
      completed: completed,
    });
  }

  function handleStatusChange(columnID: string, status: string) {
    dispatchData({
      type: "change task status",
      activeBoard: activeBoard,
      columnID: taskData.columnID,
      taskID: taskData.id,
      newColumnID: columnID,
      status: status,
    });
    dispatchTask({
      type: "change status",
      columnID: columnID,
      status: status,
    });
  }

  return (
    <div className="form view-task">
      <div className="view-task__title">
        <h2 className="hL view-task__heading">{taskData.title}</h2>
        <Select menu={true} options={["Edit Task", "Delete Task"]} />
      </div>
      {taskData.description && (
        <p className="view-task__description pL">{taskData.description}</p>
      )}
      <form className="view-task__subtasks">
        <label className="view-task__label pM">{`Subtasks (${
          taskData.subtasks.filter((subtask) => subtask.isCompleted === true)
            .length
        } of ${taskData.subtasks.length})`}</label>
        {taskData.subtasks.map((subtask) => {
          return (
            <Checkbox
              onCheck={handleSubtaskCheck}
              done={subtask.isCompleted}
              key={subtask.id}
              subtaskID={subtask.id}
            >
              {subtask.title}
            </Checkbox>
          );
        })}
      </form>
      <div className="view-task__statuses">
        <label className="view-task__label pM">Current Status</label>
        <Select
          onChange={handleStatusChange}
          activeOption={activeColumnIndex}
          options={columnsInfo}
        />
      </div>
    </div>
  );
}
