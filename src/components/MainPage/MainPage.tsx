import NavBar from "../NavBar/NavBar";
import BoardView from "../BoardView/BoardView";
import "./mainPage.scss";

type Props = {
  sidebar: boolean;
  handleHide: () => void;
};

export default function MainPage({ sidebar, handleHide }: Props) {
  return (
    <div className="main-page">
      <NavBar sidebar={sidebar} handleHide={handleHide} />
      <BoardView />
    </div>
  );
}
