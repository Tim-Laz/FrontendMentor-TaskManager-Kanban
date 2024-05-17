import NavBar from "../../Organisms/NavBar/NavBar";
import BoardView from "../../Organisms/BoardView/BoardView";
import "./mainPage.scss";

type Props = {
  sidebar: boolean;
  mobileNav: boolean;
  handleHide: () => void;
  handleMobileHide: (visible: boolean) => void;
  width: number;
};

export default function MainPage({
  sidebar,
  mobileNav,
  handleHide,
  handleMobileHide,
  width,
}: Props) {
  return (
    <div className="main-page">
      <NavBar
        mobileNav={mobileNav}
        sidebar={sidebar}
        handleHide={handleHide}
        handleMobileHide={handleMobileHide}
        width={width}
      />
      <BoardView />
    </div>
  );
}
