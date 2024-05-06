import "./select.scss";

import { useState, useRef, useEffect } from "react";
import { useOutsideClick } from "./useOutsideClick.ts";
import { useKeyPressEsc } from "./useKeyPressEsc.ts";
import { useActionDispatch } from "../../Reducers/actionContexReducer.tsx";
type selectProps = {
  options: string[];
  activeOption?: number;
  menu?: boolean;
  header?: boolean;
};

type optionProps = {
  status: string;
  i: number;
  isActive: boolean;
  isHover: boolean;
  onClick: (status: number) => void;
  onMouseEnter: (status: number) => void;
};

type dropdownProps = {
  children: React.ReactNode;
};

function Option({
  status,
  i,
  isActive,
  isHover,
  onClick,
  onMouseEnter,
}: optionProps) {
  return (
    <li
      onClick={() => onClick(i)}
      onMouseEnter={() => onMouseEnter(i)}
      className={
        "select__option pL" +
        (isActive ? " active" : "") +
        (isHover ? " hover" : "")
      }
      role="option"
    >
      {status}
    </li>
  );
}

function DropDown({ children }: dropdownProps) {
  return (
    <ul className="select__dropdown" role="listbox">
      {children}
    </ul>
  );
}

export default function Select({
  options,
  activeOption,
  menu = false,
  header = false,
}: selectProps) {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    activeOption !== undefined ? activeOption : -1
  );
  const [hoverIndex, setHoverIndex] = useState<number | undefined>(undefined);

  const activeStatus = options[activeIndex];

  const selectElRef = useRef(null);

  useOutsideClick(selectElRef, closeDropDown);

  useKeyPressEsc(closeDropDown);

  const actionDispatch = useActionDispatch();

  useEffect(() => {
    if (header && activeIndex === 0) {
      actionDispatch({ type: "editing board" });
      setActiveIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  function closeDropDown() {
    setVisible(false);
    setHoverIndex(undefined);
  }

  function handleButtonClick() {
    setVisible(!visible);
    if (visible === true) {
      setHoverIndex(undefined);
    }
  }

  function handleOptionClick(i: number) {
    setActiveIndex(i);
    setVisible(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      if (hoverIndex === undefined) {
        if (activeIndex < options.length - 1) setHoverIndex(activeIndex + 1);
        if (activeIndex === options.length - 1) setHoverIndex(0);
      }
      if (hoverIndex !== undefined && hoverIndex < options.length - 1) {
        setHoverIndex(hoverIndex + 1);
      }
      if (hoverIndex === options.length - 1) {
        setHoverIndex(0);
      }
    }
    if (e.key === "ArrowUp") {
      if (hoverIndex === undefined) {
        if (activeIndex > 0) {
          setHoverIndex(activeIndex - 1);
        }
        if (activeIndex <= 0) {
          setHoverIndex(options.length - 1);
        }
      }
      if (hoverIndex !== undefined && hoverIndex > 0) {
        setHoverIndex(hoverIndex - 1);
      }
      if (hoverIndex === 0) {
        setHoverIndex(options.length - 1);
      }
    }
    if (e.key === "Enter" && hoverIndex !== undefined) {
      setActiveIndex(hoverIndex);
    }
  }

  function handleMouseEnter(i: number) {
    setHoverIndex(i);
  }

  const list = options.map((status, i) => (
    <Option
      key={status}
      status={status}
      i={i}
      isActive={i === activeIndex && !header ? true : false}
      isHover={i === hoverIndex ? true : false}
      onClick={handleOptionClick}
      onMouseEnter={handleMouseEnter}
    />
  ));
  return (
    <div
      ref={selectElRef}
      onKeyDown={(e) => handleKeyDown(e)}
      className="select"
    >
      {menu ? (
        <button
          className={"select__menu-btn" + (header ? " header" : "")}
          onClick={handleButtonClick}
        >
          <img src="../../assets/icon-vertical-ellipsis.svg" alt="" />
        </button>
      ) : (
        <button
          className={visible ? "select__button pL active" : "select__button pL"}
          role="combobox"
          aria-labelledby="select button"
          aria-haspopup="listbox"
          aria-expanded="false"
          aria-controls="select-dropdown"
          onClick={handleButtonClick}
        >
          <span className="select__value">{activeStatus}</span>
          <span className="select__arrow">
            <img src="../../assets/icon-chevron-down.svg" alt="" />
          </span>
        </button>
      )}

      {visible && <DropDown>{list}</DropDown>}
    </div>
  );
}
