import "./deleteTaskBoard.scss";
import Button from "../../Button/Button";
import { useData, useDataDispatch } from "../../../Reducers/dataContexReducer";
import { useActionDispatch } from "../../../Reducers/actionContexReducer";
import {
  useActive,
  useActiveDispatch,
} from "../../../Reducers/activeContextReducer";

type Props = {
  type: "task" | "board";
  name: string;
  id: string;
};

export default function DeleteTaskBoard({ type, name, id }: Props) {
  const dispatchAction = useActionDispatch();
  const dispatchData = useDataDispatch();

  const data = useData();
  const activeBoard = useActive();

  const dispatchActive = useActiveDispatch();
  function handleDelete(deleteID: string) {
    if (type === "board") {
      const deletedIndex = data.boards.findIndex(
        (board) => board.id === deleteID
      );
      dispatchData({ type: "delete board", id: deleteID });
      const newActiveId =
        data.boards?.[deletedIndex + 1]?.id ||
        data.boards?.[deletedIndex - 1]?.id ||
        "";
      dispatchActive({
        type: "change active board",
        boardID: newActiveId,
      });
    }
    if (type === "task") {
      dispatchData({ type: "delete task", id: deleteID, boardID: activeBoard });
    }
    dispatchAction({ type: "" });
  }

  return (
    <div className="delete-task-board form">
      <h2 className="delete-task-board__heading hL">
        {"Delete this " + type + "?"}
      </h2>
      <p className="delete-task-board__text pL">
        {type === "task"
          ? `Are you sure you want to delete the ‘${name}’ task and its subtasks? This action cannot be reversed.`
          : `Are you sure you want to delete the ‘${name}’ board? This action will remove all columns and tasks and cannot be reversed.`}
      </p>
      <div className="delete-task-board__btns">
        <Button onClick={() => handleDelete(id)} type={"destructive"}>
          Delete
        </Button>
        <Button onClick={() => dispatchAction({ type: "" })} type={"secondary"}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
