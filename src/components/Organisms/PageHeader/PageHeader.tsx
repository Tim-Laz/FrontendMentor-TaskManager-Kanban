import "./pageHeader.scss";
import Button from "../../Atoms/Button/Button";
import Select from "../../Atoms/Select/Select";
import { useData } from "../../../Reducers/dataContexReducer";
import { useActive } from "../../../Reducers/activeContextReducer";
import { useActionDispatch } from "../../../Reducers/actionContexReducer";

type Props = {
  sidebar: boolean;
  mobileNav: boolean;
  handleMobileHide: (visible: boolean) => void;
  width: number;
};

export default function PageHeader({
  sidebar,
  mobileNav,
  handleMobileHide,
  width,
}: Props) {
  const data = useData();
  const activeBoard = useActive();
  const activeBoardName = data.boards?.find(
    (board) => board.id === activeBoard
  )?.name;
  //Viewport width breakpoint to apply different styles depending on opened / closed sidebar or mobile navigation
  const breakpoint = 750;

  const dispatchAction = useActionDispatch();

  function handleMobileClick() {
    handleMobileHide(true);
  }

  return (
    <header
      className={
        "page-header" +
        ((sidebar && width > breakpoint) || (mobileNav && width < breakpoint)
          ? " opened"
          : "")
      }
    >
      <div className="page-header__icon-container">
        <div className="page-header__icon"></div>
      </div>
      <div className="page-header__content">
        <div className="page-header__heading-container">
          <h1 className="page-header__heading hXL">{activeBoardName}</h1>
          <button
            onClick={handleMobileClick}
            className="page-header__btn-mobile-nav page-header__btn-mobile-nav-open"
          >
            <img
              src="../../assets/icon-chevron-down.svg"
              alt="mobile open icon"
            />
          </button>
          <button className="page-header__btn-mobile-nav page-header__btn-mobile-nav-close">
            <img
              src="../../assets/icon-chevron-up.svg"
              alt="mobile close icon"
            />
          </button>
        </div>
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
            type={"primary-L-header"}
          >
            {width > breakpoint ? (
              "+ Add New Task"
            ) : (
              <img src="../../assets/icon-add-task-mobile.svg" />
            )}
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
