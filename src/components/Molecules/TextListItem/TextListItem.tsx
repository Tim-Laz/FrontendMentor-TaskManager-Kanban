import "./textListItem.scss";
import TextField from "../../Atoms/TextField/TextField";
import IconCross from "../../Atoms/Icons/IconCross";

type subtaskProps = {
  placeholder: string;
  onClick: (id: string) => void;
  value?: string;
  id: string;
  error?: boolean;
};

export default function TextListItem({
  placeholder,
  onClick,
  value,
  id,
  error,
}: subtaskProps) {
  return (
    <div className="text-list-item">
      <TextField
        error={error}
        inputName={id}
        value={value}
        placeholder={placeholder}
        autoFocus={!value}
      />
      <button onClick={() => onClick(id)} className="text-list-item__btn">
        <IconCross />
      </button>
    </div>
  );
}
