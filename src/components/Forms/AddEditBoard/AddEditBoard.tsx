import TextListItem from "../../TextListItem/TextListItem";
import TextField from "../../TextField/TextField";
import Button from "../../Button/Button";
import "./addEditBoard.scss";
import TextList from "../../TextList/TextList";
import { useDataDispatch } from "../../../Reducers/dataContexReducer";
import { v4 as uuidv4 } from "uuid";
import { useActionDispatch } from "../../../Reducers/actionContexReducer";

type Props = {
  boardData?: any;
};

export default function AddEditBoard({ boardData }: Props) {
  const dataDispatch = useDataDispatch();
  const actionDispatch = useActionDispatch();
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    let boardName;
    const columns = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("board")) {
        boardName = value;
      }
      if (key.startsWith("column")) {
        columns.push({ id: key, name: value, tasks: [] });
      }
    }

    boardData
      ? dataDispatch({
          type: "edit board",
          id: boardData.id,
          name: boardName,
          columns: columns,
        })
      : dataDispatch({
          type: "add board",
          id: "board-" + uuidv4(),
          name: boardName,
          columns: columns,
        });
    actionDispatch({ type: "" });
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="form add-edit-board">
      <h2 className="add-edit-board__heading hL">
        {boardData ? "Edit Board" : "Add New Board"}
      </h2>
      <div className="add-edit-board__name">
        <label className="add-edit-board__label pM">Board Name</label>
        <TextField
          value={boardData ? boardData?.name : ""}
          inputName="boardName"
          placeholder="e.g. Web Design"
        />
      </div>
      <TextList
        items={boardData?.columns ? boardData.columns : []}
        itemType="column"
      />
      <Button btnAction="submit" onClick={() => {}} type={"primary-S"}>
        {boardData ? "Save Changes" : "Create New Board"}
      </Button>
    </form>
  );
}
