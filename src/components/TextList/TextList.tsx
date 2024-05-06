import "./textList.scss";
import TextListItem from "../TextListItem/TextListItem";
import Button from "../Button/Button";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type Props = {
  handleDelete?: (id: string) => void; //remove
  items?: { id: string; name: string }[];
  itemType: "subtask" | "column";
};

export default function TextList({ items = [], itemType }: Props) {
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
            {itemType === "subtask" ? "Subtasks" : "Board Columns"}
          </label>
          {list.map((item) => {
            return (
              <TextListItem
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
        + Add New Column
      </Button>
    </div>
  );
}
