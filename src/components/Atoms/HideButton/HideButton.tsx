import { ReactNode } from "react";
import "./hideButton.scss";
import IconHide from "../Icons/IconHide";
import IconShow from "../Icons/IconShow";

type Props = {
  children?: ReactNode;
  onClick: () => void;
  status: string;
  sidebar?: boolean;
};

export default function SideButton({
  children,
  onClick,
  status,
  sidebar,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={
        "hide-btn" +
        (status === "show" && sidebar ? " hidden" : "") +
        (status === "show" ? " show" : "") +
        (status === "hide" ? " hide" : "")
      }
    >
      {status === "show" ? (
        <IconShow />
      ) : (
        <>
          <IconHide />
          <p className="hide-btn__text hM">{children}</p>
        </>
      )}
    </button>
  );
}
