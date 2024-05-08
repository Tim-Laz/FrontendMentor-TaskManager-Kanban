import "./pageHeader.scss";
import Button from "../Button/Button";
import Select from "../Select/Select";
import { useData } from "../../Reducers/dataContexReducer";
import { useActive } from "../../Reducers/activeContextReducer";
import { useActionDispatch } from "../../Reducers/actionContexReducer";

type Props = {
  sidebar: boolean;
};

export default function PageHeader({ sidebar }: Props) {
  const data = useData();
  const dispatchAction = useActionDispatch();

  const activeBoard = useActive();
  const activeBoardName = data.boards?.find(
    (board) => board.id === activeBoard
  )?.name;

  return (
    <header className={"page-header" + (sidebar ? " opened" : "")}>
      <div className="page-header__icon-container">
        <div className="page-header__icon"></div>
      </div>
      <div className="page-header__content">
        <h1 className="page-header__heading hXL">{activeBoardName}</h1>
        <div className="page-header__menu">
          <Button
            onClick={() => {
              dispatchAction({ type: "adding new task" });
            }}
            disabled={
              !activeBoard ||
              !data.boards?.find((board) => board.id === activeBoard)?.columns
                .length
            }
            type={"primary-L"}
          >
            + Add New Task
          </Button>
          <Select
            disabled={!activeBoard}
            header={true}
            menu={true}
            options={["Edit Board", "Delete Board"]}
          />
        </div>
      </div>
    </header>
  );
}
