import "./button.scss";

type Props = {
  onClick?: () => void;
  children: React.ReactNode;
  type:
    | "primary-L"
    | "primary-L-header"
    | "primary-S"
    | "secondary"
    | "destructive";
  btnAction?: "button" | "submit";
  disabled?: boolean;
};

export default function Button({
  children,
  type,
  onClick,
  btnAction = "button",
  disabled = false,
}: Props) {
  const classType = `btn btn-${type}${disabled ? " disabled" : ""}`;
  return (
    <button
      disabled={disabled}
      type={btnAction}
      onClick={onClick}
      className={classType}
    >
      {children}
    </button>
  );
}
