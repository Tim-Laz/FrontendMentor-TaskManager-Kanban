import "./textField.scss";
import { useState } from "react";
type Props = {
  placeholder: string;
  error?: boolean;
  big?: boolean;
  value?: string;
  errorText?: string;
  inputName: string;
};

export default function TextField({
  placeholder,
  error = false,
  big = false,
  value = "",
  errorText = "Can't be empty",
  inputName,
}: Props) {
  // const [text, setText] = useState(value !== undefined ? value : "");
  // const handleChange: React.ChangeEventHandler<
  //   HTMLTextAreaElement | HTMLInputElement
  // > = (e) => {
  //   setText(e.target.value);
  // };
  return (
    <div
      className={
        (error ? "error text-field" : "text-field") + (big ? " big" : "")
      }
    >
      {big ? (
        <textarea
          name={inputName}
          // onChange={handleChange}
          className="text-field__input pL"
          placeholder={placeholder}
          defaultValue={value}
        ></textarea>
      ) : (
        <input
          name={inputName}
          // onChange={handleChange}
          className="text-field__input pL"
          type="text"
          placeholder={placeholder}
          defaultValue={value}
        ></input>
      )}

      {error && <p className="text-field__error pL">{errorText}</p>}
    </div>
  );
}
