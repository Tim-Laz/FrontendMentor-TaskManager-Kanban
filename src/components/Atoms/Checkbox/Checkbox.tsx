import "./checkbox.scss";
import { useState } from "react";

type Props = {
  children: string;
  subtaskID: string;
  done: boolean;
  onCheck: (subtaskID: string, completed: boolean) => void;
};

export default function Checkbox({
  children,
  subtaskID,
  done,
  onCheck,
}: Props) {
  const [checked, setChecked] = useState(done);

  function handleChange() {
    onCheck(subtaskID, !checked);
    setChecked(!checked);
  }

  return (
    <div onClick={handleChange} className="checkbox">
      <input
        name={subtaskID}
        onChange={handleChange}
        checked={checked}
        className="checkbox__input"
        type="checkbox"
      ></input>
      <label className="checkbox__label pM">{children}</label>
    </div>
  );
}
