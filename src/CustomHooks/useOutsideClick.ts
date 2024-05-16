import { MutableRefObject, useEffect } from "react";

export function useOutsideClick(
  el: MutableRefObject<HTMLElement | null>,
  callback: () => void
) {
  useEffect(() => {
    const clickCallback = function (e: MouseEvent) {
      if (!el.current) return;
      const target = e.target as Element;
      if (!el.current.contains(target)) {
        callback();
      }
    };

    document.addEventListener("click", clickCallback);

    return () => document.removeEventListener("click", clickCallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
