import "./deleteTaskBoard.scss";
import Button from "../../Button/Button";

type Props = {
  type: "task" | "board";
  name: string;
};
export default function DeleteTaskBoard({ type, name }: Props) {
  return (
    <div className="delete-task-board form">
      <h2 className="delete-task-board__heading hL">
        {"Delete this " + type + "?"}
      </h2>
      <p className="delete-task-board__text pL">
        {type === "task"
          ? `Are you sure you want to delete the ‘${name}’ task? and its subtasks? This action cannot be reversed.`
          : `Are you sure you want to delete the ‘${name}’ board? This action will remove all columns and tasks and cannot be reversed.`}
      </p>
      <div className="delete-task-board__btns">
        <Button onClick={() => {}} type={"destructive"}>
          Delete
        </Button>
        <Button onClick={() => {}} type={"secondary"}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
