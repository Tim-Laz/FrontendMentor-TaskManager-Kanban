import "./textListItem.scss";
import TextField from "../TextField/TextField";
import IconCross from "../Icons/IconCross";

type subtaskProps = {
  placeholder: string;
  onClick: (id: string) => void;
  value?: string;
  id: string;
};

export default function TextListItem({
  placeholder,
  onClick,
  value,
  id,
}: subtaskProps) {
  return (
    <div className="subtask">
      <TextField inputName={id} value={value} placeholder={placeholder} />
      <button onClick={() => onClick(id)} className="subtask__btn">
        <IconCross />
      </button>
    </div>
  );
}
