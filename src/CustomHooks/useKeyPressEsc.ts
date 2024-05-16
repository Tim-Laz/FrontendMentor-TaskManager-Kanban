import { KeyboardEvent, MutableRefObject, useEffect } from "react";

export function useKeyPressEsc(
  selectElRef: MutableRefObject<HTMLElement | null>,
  callback: () => void
) {
  useEffect(() => {
    const handleKeyDown = (event: Event) => {
      const unknownEvent = event as unknown;
      const keyboardEvent = unknownEvent as KeyboardEvent;
      if (keyboardEvent.key === "Escape") {
        keyboardEvent.stopPropagation();
        //removes focus from the current element so next esc press will close the next parent element
        (<HTMLElement>keyboardEvent.target)?.blur();
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
