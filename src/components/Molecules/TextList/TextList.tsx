import "./textList.scss";
import TextListItem from "../TextListItem/TextListItem";
import Button from "../../Atoms/Button/Button";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type Props = {
  items?: { id: string; name: string }[];
  itemType: "subtask" | "column";
  emptyInputs?: string[];
};

export default function TextList({ items = [], itemType, emptyInputs }: Props) {
  const [list, setList] = useState(items);

  function handleAdd() {
    const newList = [...list, { id: itemType + "-" + uuidv4(), name: "" }];
    setList(newList);
  }

  function handleDelete(id: string) {
    const newList = list.filter((item) => item.id !== id);
    setList(newList);
  }

  return (
    <div className="textlist">
      {list.length > 0 && (
        <>
          <label className="textlist__label pM">
            {itemType === "column" ? "Board Columns" : "Subtasks"}
          </label>
          {list.map((item) => {
            return (
              <TextListItem
                error={emptyInputs?.includes(item.id)}
                key={item.id}
                value={item.name}
                id={item.id}
                onClick={handleDelete}
                placeholder={
                  itemType === "subtask" ? "e.g. Make coffee" : "e.g. Todo"
                }
              />
            );
          })}
        </>
      )}

      <Button onClick={handleAdd} type={"secondary"}>
        {"+ Add New" + (itemType === "column" ? " Column" : " Subtask")}
      </Button>
    </div>
  );
}
