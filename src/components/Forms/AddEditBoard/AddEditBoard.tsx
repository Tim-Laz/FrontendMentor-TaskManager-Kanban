import TextField from "../../TextField/TextField";
import Button from "../../Button/Button";
import "./addEditBoard.scss";
import TextList from "../../TextList/TextList";
import {
  BoardType,
  useDataDispatch,
} from "../../../Reducers/dataContexReducer";
import { v4 as uuidv4 } from "uuid";
import { useActionDispatch } from "../../../Reducers/actionContexReducer";
import { useActiveDispatch } from "../../../Reducers/activeContextReducer";
import { useState } from "react";

type Props = {
  boardData?: BoardType;
};

export default function AddEditBoard({ boardData }: Props) {
  const [emptyInputs, setEmptyInputs] = useState<string[]>([]);
  const dispatchData = useDataDispatch();
  const dispatchAction = useActionDispatch();
  const dispatchActive = useActiveDispatch();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    let boardName;
    const columns = [];
    const emptyInputs: string[] = [];
    for (const [key, value] of formData.entries()) {
      if (String(value).trim() === "") {
        emptyInputs.push(key);
      }
      if (key.startsWith("board")) {
        boardName = value;
      }
      if (key.startsWith("column")) {
        columns.push({ id: key, name: String(value), tasks: [] });
      }
    }

    if (emptyInputs.length > 0) {
      setEmptyInputs(emptyInputs);
      return;
    }

    if (boardData) {
      dispatchData({
        type: "edit board",
        id: boardData.id,
        name: String(boardName),
        columns: columns,
      });
    } else {
      const newId = "board-" + uuidv4();
      dispatchData({
        type: "add board",
        id: newId,
        name: String(boardName),
        columns: columns,
      });
      dispatchActive({
        type: "change active board",
        boardID: newId,
      });
    }

    dispatchAction({ type: "" });
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="form add-edit-board">
      <h2 className="add-edit-board__heading hL">
        {boardData ? "Edit Board" : "Add New Board"}
      </h2>
      <div className="add-edit-board__name">
        <label className="add-edit-board__label pM">Board Name</label>
        <TextField
          autoFocus={true}
          value={boardData ? boardData?.name : ""}
          inputName="boardName"
          placeholder="e.g. Web Design"
          error={emptyInputs.includes("boardName")}
        />
      </div>
      <TextList
        items={boardData?.columns ? boardData.columns : []}
        itemType="column"
        emptyInputs={emptyInputs}
      />
      <Button btnAction="submit" onClick={() => {}} type={"primary-S"}>
        {boardData ? "Save Changes" : "Create New Board"}
      </Button>
    </form>
  );
}
