import "./button.scss";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
  type: "primary-L" | "primary-S" | "secondary" | "destructive";
  btnAction?: "button" | "submit";
};

export default function Button({
  children,
  type,
  onClick,
  btnAction = "button",
}: Props) {
  const classType = `btn btn-${type}`;
  return (
    <button type={btnAction} onClick={onClick} className={classType}>
      {children}
    </button>
  );
}
