import Button from "../../Button/Button";
import "./addEditTask.scss";
import TextField from "../../TextField/TextField";
import Select from "../../Select/Select";
import { useState } from "react";
import TextListItem from "../../TextListItem/TextListItem";
import TextList from "../../TextList/TextList";
import { v4 as uuidv4 } from "uuid";
import { useData, useDataDispatch } from "../../../Reducers/dataContexReducer";
import { useActive } from "../../../Reducers/activeContextReducer";
import { useActionDispatch } from "../../../Reducers/actionContexReducer";

type taskProps = {
  taskData?: {
    id: string;
    title: string;
    description: string;
    status: string;
    columnID: string;
    subtasks: { id: string; title: string; isCompleted: boolean }[];
  };
};

export default function AddEditTask({ taskData }: taskProps) {
  const [subtasks, setSubtasks] = useState(
    Array.isArray(taskData?.subtasks) ? taskData?.subtasks : ["", ""]
  );
  const [emptyInputs, setEmptyInputs] = useState<string[]>([]);
  const editTask = taskData ? true : false;

  const dispatchData = useDataDispatch();
  const dispatchAction = useActionDispatch();

  const activeBoard = useActive();
  const data = useData();
  const activeBoardIndex = data.boards.findIndex(
    (board) => board.id === activeBoard
  );
  const columnsInfo = data.boards[activeBoardIndex].columns.reduce(
    (acc: { optionID: string[]; optionName: string[] }, column) => {
      acc.optionID.push(column.id);
      acc.optionName.push(column.name);
      return acc;
    },
    { optionID: [], optionName: [] }
  );

  const activeColumnIndex =
    columnsInfo.optionID.findIndex((option) => option === taskData?.columnID) >=
    0
      ? columnsInfo.optionID.findIndex(
          (option) => option === taskData?.columnID
        )
      : 0;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    let taskTitle;
    let taskDescription;
    let taskColumnID;
    let taskColumnName;
    const taskSubtasks = [];
    const emptyInputsForm: string[] = [];
    for (const [key, value] of formData.entries()) {
      if (String(value).trim() === "" && key !== "description") {
        emptyInputsForm.push(key);
      }
      if (key === "title") {
        taskTitle = value;
      }
      if (key === "description") {
        taskDescription = value;
      }
      if (key === "optionID") {
        taskColumnID = value;
      }
      if (key === "optionName") {
        taskColumnName = value;
      }
      if (key.startsWith("subtask")) {
        taskSubtasks.push({
          id: key,
          title: value,
          isCompleted: false,
        });
      }
    }

    if (emptyInputsForm.length > 0) {
      setEmptyInputs(emptyInputsForm);
      return;
    }

    if (taskData) {
      dispatchData({
        type: "edit task",
        activeBoard: activeBoard,
        id: taskData.id,
        title: taskTitle,
        description: taskDescription,
        status: taskColumnName,
        subtasks: taskSubtasks,
        columnID: taskData.columnID,
        newColumnID: taskColumnID,
      });
    } else {
      const newId = "task-" + uuidv4();
      dispatchData({
        type: "add task",
        activeBoard: activeBoard,
        id: newId,
        title: taskTitle,
        description: taskDescription,
        status: taskColumnName,
        subtasks: taskSubtasks,
        columnID: taskColumnID,
      });
    }

    dispatchAction({ type: "" });
  }

  return (
    <form className="form add-edit-task" onSubmit={(e) => handleSubmit(e)}>
      <h2 className="add-edit-task__heading hL">
        {editTask ? "Edit Task" : "Add New Task"}
      </h2>
      <div
        className="add-edit-task__tit
      le"
      >
        <label className="add-edit-task__label pM">Title</label>
        <TextField
          autoFocus={true}
          inputName={"title"}
          value={taskData ? taskData.title.toString() : ""}
          placeholder="e.g. Take coffee break"
          error={emptyInputs.includes("title")}
        />
      </div>
      <div className="add-edit-task__description">
        <label className="add-edit-task__label pM">Description</label>
        <TextField
          inputName="description"
          value={taskData ? taskData.description.toString() : ""}
          big={true}
          placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
        />
      </div>
      <div className="add-edit-task__subtasks">
        <TextList
          emptyInputs={emptyInputs}
          itemType="subtask"
          items={
            taskData
              ? taskData.subtasks.reduce(
                  (acc: { id: string; name: string }[], subtask) => {
                    acc.push({
                      id: subtask.id,
                      name: subtask.title,
                    });
                    return acc;
                  },
                  []
                )
              : []
          }
        />
      </div>
      <div className="add-edit-task__status">
        <Select activeOption={activeColumnIndex} options={columnsInfo}></Select>
      </div>
      <Button btnAction="submit" type={"primary-S"}>
        {taskData ? "Save Changes" : "Create Task"}
      </Button>
    </form>
  );
}
