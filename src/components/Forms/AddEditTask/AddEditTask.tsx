import Button from "../../Button/Button";
import "./addEditTask.scss";
import TextField from "../../TextField/TextField";
import Select from "../../Select/Select";
import { useState } from "react";
import TextListItem from "../../TextListItem/TextListItem";

type taskProps = {
  taskData?: Record<string, string | string[]>;
};

export default function AddEditTask({ taskData }: taskProps) {
  const [subtasks, setSubtasks] = useState(
    Array.isArray(taskData?.subtasks) ? taskData?.subtasks : ["", ""]
  );
  const editTask = taskData ? true : false;

  function handleDeleteSubtask(index: number) {
    const newSubtasks = subtasks.filter((subtask, i) => index !== i);
    setSubtasks(newSubtasks);
  }

  function addNewSubtask() {
    const newSubtasks = [...subtasks, ""];
    setSubtasks(newSubtasks);
  }

  return (
    <form
      className="form add-edit-task"
      onSubmit={(e) => {
        e.preventDefault();
        // console.log(e.target);
        const formData = new FormData(e.target as HTMLFormElement);
        for (const [key, value] of formData.entries()) {
          // console.log(key, value);
        }
        // console.log(formData);
      }}
    >
      <h2 className="add-edit-task__heading hL">
        {editTask ? "Edit Task" : "Add New Task"}
      </h2>
      <div
        className="add-edit-task__tit
      le"
      >
        <label className="add-edit-task__label pM">Title</label>
        <TextField
          name={"title"}
          value={taskData?.title?.toString()}
          placeholder="e.g. Take coffee break"
        />
      </div>
      <div className="add-edit-task__description">
        <label className="add-edit-task__label pM">Description</label>
        <TextField
          value={taskData?.description?.toString()}
          big={true}
          placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
        />
      </div>
      <div className="add-edit-task__subtasks">
        <label className="add-edit-task__label pM">Subtasks</label>
        {subtasks.map((subtask, i) => (
          <TextListItem
            key={i}
            id={i}
            value={subtask}
            placeholder={"e.g. Make coffee"}
            onClick={handleDeleteSubtask}
          ></TextListItem>
        ))}
        <Button onClick={addNewSubtask} type={"secondary"}>
          + Add New Subtask
        </Button>
      </div>
      <div className="add-edit-task__status">
        <Select
          activeOption={0}
          options={["Todo", "In Progress", "Done"]}
        ></Select>
      </div>
      <Button type={"primary-S"}>Save Changes</Button>
    </form>
  );
}
