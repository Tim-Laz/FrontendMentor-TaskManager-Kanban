import "./select.scss";

import { useState, useRef, useEffect } from "react";
import { useOutsideClick } from "../../CustomHooks/useOutsideClick.ts";
import { useKeyPressEsc } from "../../CustomHooks/useKeyPressEsc.ts";
import { useActionDispatch } from "../../Reducers/actionContexReducer.tsx";
import { autoUpdate, useFloating } from "@floating-ui/react";

type optionsData = {
  optionID: string[];
  optionName: string[];
};
type selectProps = {
  options: string[] | optionsData;
  activeOption?: number;
  menu?: boolean;
  header?: boolean;
  disabled?: boolean;
  onChange?: (columnID: string, status: string) => void;
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
  refs: any;
  styles: any;
};

function Option({
  status,
  i,
  isActive,
  isHover,
  onClick,
  onMouseEnter,
}: optionProps) {
  const activeOption = useRef<HTMLLIElement>(null);

  //Scroll to active option
  useEffect(() => {
    const options = {
      threshold: 1,
    };

    const target = activeOption.current;

    const callback = (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) => {
      if (!entries[0].isIntersecting) {
        target?.scrollIntoView();
      }
      observer.unobserve(target as Element);
    };

    const observer = new IntersectionObserver(callback, options);

    if (isActive) {
      observer.observe(target as Element);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Scroll to hover option
  useEffect(() => {
    const options = {
      threshold: 0.1,
    };

    const target = activeOption.current;

    const callback = (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) => {
      if (!entries[0].isIntersecting) {
        target?.scrollIntoView({ behavior: "smooth" });
      }
    };

    const observer = new IntersectionObserver(callback, options);

    if (isHover) {
      observer.observe(target as Element);
    }

    return () => {
      observer.unobserve(target as Element);
    };
  }, [isHover]);

  return (
    <li
      ref={activeOption}
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

function DropDown({ children, refs, styles }: dropdownProps) {
  return (
    <ul
      ref={refs.setFloating}
      style={styles}
      className="select__dropdown"
      role="listbox"
    >
      {children}
    </ul>
  );
}

export default function Select({
  options,
  activeOption,
  menu = false,
  header = false,
  disabled = false,
  onChange,
}: selectProps) {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    activeOption !== undefined ? activeOption : -1
  );
  const [hoverIndex, setHoverIndex] = useState<number | undefined>(undefined);
  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
  });

  const optionsSelect = Array.isArray(options) ? options : options.optionName;

  const activeStatus = optionsSelect[activeIndex];

  const selectElRef = useRef(null);

  useOutsideClick(selectElRef, closeDropDown);

  useKeyPressEsc(selectElRef, closeDropDown);

  const actionDispatch = useActionDispatch();

  useEffect(() => {
    if (header && activeIndex === 0) {
      actionDispatch({ type: "editing board" });
      setActiveIndex(-1);
    }
    if (header && activeIndex === 1) {
      actionDispatch({ type: "deleting board confirmation" });
      setActiveIndex(-1);
    }
    if (menu && !header && activeIndex === 0) {
      actionDispatch({ type: "editing task" });
      setActiveIndex(-1);
    }
    if (menu && !header && activeIndex === 1) {
      actionDispatch({ type: "deleting task confirmation" });
      setActiveIndex(-1);
    }

    if (onChange && activeOption !== activeIndex) {
      if (!Array.isArray(options)) {
        const columnID = options.optionID[activeIndex];
        const status = options.optionName[activeIndex];
        onChange(columnID, status);
      }
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
        if (activeIndex < optionsSelect.length - 1)
          setHoverIndex(activeIndex + 1);
        if (activeIndex === optionsSelect.length - 1) setHoverIndex(0);
      }
      if (hoverIndex !== undefined && hoverIndex < optionsSelect.length - 1) {
        setHoverIndex(hoverIndex + 1);
      }
      if (hoverIndex === optionsSelect.length - 1) {
        setHoverIndex(0);
      }
    }
    if (e.key === "ArrowUp") {
      if (hoverIndex === undefined) {
        if (activeIndex > 0) {
          setHoverIndex(activeIndex - 1);
        }
        if (activeIndex <= 0) {
          setHoverIndex(optionsSelect.length - 1);
        }
      }
      if (hoverIndex !== undefined && hoverIndex > 0) {
        setHoverIndex(hoverIndex - 1);
      }
      if (hoverIndex === 0) {
        setHoverIndex(optionsSelect.length - 1);
      }
    }
    if (e.key === "Enter" && hoverIndex !== undefined) {
      setActiveIndex(hoverIndex);
    }
  }

  function handleMouseEnter(i: number) {
    setHoverIndex(i);
  }

  const list = optionsSelect.map((status, i) => (
    <Option
      key={i}
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
      // ref={selectElRef}
      ref={refs.setReference}
      onKeyDown={(e) => handleKeyDown(e)}
      className="select"
    >
      <input
        name="optionID"
        className="select__hiddenInput"
        value={!Array.isArray(options) ? options?.optionID?.[activeIndex] : ""}
        onChange={() => {}}
      ></input>
      <input
        name="optionName"
        className="select__hiddenInput"
        value={
          !Array.isArray(options) ? options?.optionName?.[activeIndex] : ""
        }
        onChange={() => {}}
      ></input>
      {menu ? (
        <button
          // ref={refs.setReference}
          type="button"
          disabled={disabled}
          className={
            "select__menu-btn" +
            (header ? " header" : "") +
            (disabled ? " disabled" : "")
          }
          onClick={handleButtonClick}
        >
          <img src="../../assets/icon-vertical-ellipsis.svg" alt="" />
        </button>
      ) : (
        <button
          className={visible ? "select__button pL active" : "select__button pL"}
          role="combobox"
          type="button"
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

      {visible && (
        <DropDown refs={refs} styles={floatingStyles}>
          {list}
        </DropDown>
      )}
    </div>
  );
}
