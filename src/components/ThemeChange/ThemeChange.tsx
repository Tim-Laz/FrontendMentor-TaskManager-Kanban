import "./themeChange.scss";
import { useState, useEffect } from "react";

export default function ThemeChange() {
  let localTheme: boolean | undefined;

  if (localStorage?.getItem("theme") === "true") {
    localTheme = true;
  } else if (localStorage?.getItem("theme") === "false") {
    localTheme = false;
  } else {
    localTheme = undefined;
  }

  const [isDark, setIsDark] = useState(localTheme);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    if (localTheme === undefined) {
      setIsDark(true);
    }

    mq.addEventListener("change", (evt) => {
      if (localTheme === undefined) {
        setIsDark(evt.matches);
      }
    });

    return mq.removeEventListener("change", (evt) => {
      if (localTheme === undefined) {
        setIsDark(evt.matches);
      }
    });
  }, [localTheme]);

  function handleChange() {
    const newIsDark = !isDark ? true : false;
    setIsDark(newIsDark);
    localStorage.setItem("theme", JSON.stringify(newIsDark));
  }

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDark]);

  return (
    <div className="theme-change">
      <img src="./assets/icon-light-theme.svg" alt="light mode icon" />
      <label className="theme-change__switch" htmlFor="theme-switch">
        <input
          onChange={handleChange}
          className="theme-change__switch--input"
          type="checkbox"
          id="theme-switch"
          checked={isDark}
        />
        <span className="theme-change__switch-slider"></span>
      </label>
      <img src="./assets/icon-dark-theme.svg" alt="dark mode icon" />
    </div>
  );
}
