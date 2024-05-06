import "./checkbox.scss";
import { useState } from "react";

type Props = {
  children: string;
};

export default function Checkbox({ children }: Props) {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };
  return (
    <div onClick={handleChange} className="checkbox">
      <input
        onChange={handleChange}
        checked={checked}
        className="checkbox__input"
        type="checkbox"
      ></input>
      <label className="checkbox__label pM">{children}</label>
    </div>
  );
}
