import { KeyboardEvent, MutableRefObject, useEffect } from "react";

export function useKeyPressEsc(
  selectElRef: MutableRefObject<HTMLElement | null>,
  callback: () => void
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        //removes focus from the current element so next esc press will close the next parent element
        (<HTMLElement>event.target)?.blur();
        callback();
      }
    };

    const currentRef = selectElRef.current;

    currentRef?.addEventListener("keydown", handleKeyDown);

    return () => {
      currentRef?.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
