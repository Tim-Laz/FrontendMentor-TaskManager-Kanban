import "./navBoardItem.scss";
import IconBoard from "../Icons/IconBoard";
import React from "react";

type props = {
  children: React.ReactNode;
  status: string;
  onClick: () => void;
};

export default function NavBoardItem({ children, status, onClick }: props) {
  return (
    <button onClick={onClick} className={"nav-board-item" + " " + status || ""}>
      <>
        <IconBoard />
        <p className="nav-board-item__text hM">{children}</p>
      </>
    </button>
  );
}
