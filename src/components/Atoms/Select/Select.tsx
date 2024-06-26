import "./select.scss";

import { useState, useRef, useEffect, MutableRefObject } from "react";
import { useOutsideClick } from "../../../CustomHooks/useOutsideClick.ts";
import { useKeyPressEsc } from "../../../CustomHooks/useKeyPressEsc.ts";
import { useActionDispatch } from "../../../Reducers/actionContexReducer.tsx";
import {
  autoUpdate,
  useFloating,
  FloatingPortal,
  useDismiss,
  useInteractions,
  shift,
  flip,
  offset,
} from "@floating-ui/react";

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
  menu: boolean;
  header: boolean;
  setFloating: (node: HTMLElement | null) => void;
  styles: React.CSSProperties;
  getFloatingProps: (
    userProps?: React.HTMLProps<HTMLElement> | undefined
  ) => Record<string, unknown>;
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

    const callback = (entries: IntersectionObserverEntry[]) => {
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

function DropDown({
  children,
  menu,
  header,
  setFloating,
  styles,
  getFloatingProps,
}: dropdownProps) {
  return (
    <ul
      ref={setFloating}
      style={styles}
      {...getFloatingProps()}
      className={
        "select__dropdown" + (menu ? " menu" : "") + (header ? " header" : "")
      }
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

  const optionsSelect = Array.isArray(options) ? options : options.optionName;

  const activeStatus = optionsSelect[activeIndex];
  const actionDispatch = useActionDispatch();

  //Floating UI library for positioning, portal and closing on scroll

  const placementPos = header ? "bottom-end" : "bottom";

  const { refs, floatingStyles, context } = useFloating<HTMLElement>({
    middleware: [offset(7), shift(), flip()],
    placement: placementPos,
    whileElementsMounted: autoUpdate,
    open: visible,
    onOpenChange: setVisible,
  });
  const dismiss = useDismiss(context, {
    escapeKey: false,
    outsidePress: false,
    ancestorScroll: true,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

  //Closing on esc and outside click

  useOutsideClick(
    refs.reference as MutableRefObject<HTMLElement | null>,
    closeDropDown
  );

  useKeyPressEsc(
    refs.reference as MutableRefObject<HTMLElement | null>,
    closeDropDown
  );

  //Dispatching on active index change

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

  //Callbacks

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

  function handleMouseEnter(i: number) {
    setHoverIndex(i);
  }

  //up and down keys dropdown navigation

  function handleKeyDown(e: React.KeyboardEvent) {
    e.preventDefault();
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

  //Dropdown list options
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
      ref={refs.setReference}
      {...getReferenceProps()}
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
          type="button"
          disabled={disabled}
          className={
            "select__menu-btn" +
            (header ? " header" : "") +
            (disabled ? " disabled" : "")
          }
          onClick={handleButtonClick}
        >
          <img src="./assets/icon-vertical-ellipsis.svg" alt="" />
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
            <img src="./assets/icon-chevron-down.svg" alt="" />
          </span>
        </button>
      )}

      {visible && (
        <FloatingPortal id="root">
          <DropDown
            menu={menu}
            header={header}
            setFloating={refs?.setFloating}
            styles={floatingStyles}
            getFloatingProps={getFloatingProps}
          >
            {list}
          </DropDown>
        </FloatingPortal>
      )}
    </div>
  );
}
