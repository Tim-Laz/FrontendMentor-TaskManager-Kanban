import "./pageHeader.scss";
import Button from "../Button/Button";
import Select from "../Select/Select";

type Props = {
  sidebar: boolean;
  activeBoard: string;
};

export default function PageHeader({ sidebar, activeBoard }: Props) {
  return (
    <header className={"page-header" + (sidebar ? " opened" : "")}>
      <div className="page-header__icon-container">
        <div className="page-header__icon"></div>
      </div>
      <div className="page-header__content">
        <h1 className="page-header__heading hXL">{activeBoard}</h1>
        <div className="page-header__menu">
          <Button type={"primary-L"}>+ Add New Task</Button>
          <Select
            header={true}
            menu={true}
            options={["Edit Board", "Delete Board"]}
          />
        </div>
      </div>
    </header>
  );
}
