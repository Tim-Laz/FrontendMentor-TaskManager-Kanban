import "./textField.scss";
import { useState } from "react";
type Props = {
  placeholder: string;
  error?: boolean;
  big?: boolean;
  value?: string;
  errorText?: string;
  inputName: string;
  autoFocus?: boolean;
};

export default function TextField({
  placeholder,
  error = false,
  big = false,
  value = "",
  errorText = "Can't be empty",
  inputName,
  autoFocus = false,
}: Props) {
  const [text, setText] = useState(value !== undefined ? value : "");
  const handleChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (e) => {
    setText(e.target.value);
  };
  return (
    <div
      className={
        (error && !text.trim() ? "error text-field" : "text-field") +
        (big ? " big" : "")
      }
    >
      {big ? (
        <textarea
          autoFocus={autoFocus}
          name={inputName}
          onChange={handleChange}
          className="text-field__input pL"
          placeholder={placeholder}
          value={text}
        ></textarea>
      ) : (
        <input
          autoFocus={autoFocus}
          name={inputName}
          onChange={handleChange}
          className="text-field__input pL"
          type="text"
          placeholder={placeholder}
          value={text}
        ></input>
      )}

      {error && !text.trim() && (
        <p className="text-field__error pL">{errorText}</p>
      )}
    </div>
  );
}
