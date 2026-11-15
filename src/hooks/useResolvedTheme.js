import { useEffect, useState } from "react";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function useResolvedTheme(theme) {
  const [systemTheme, setSystemTheme] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return "dark";
    return getSystemTheme();
  });

  useEffect(() => {
    if (theme !== "auto" || !window.matchMedia) return undefined;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = (event) => setSystemTheme(event.matches ? "light" : "dark");
    setSystemTheme(mediaQuery.matches ? "light" : "dark");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return theme === "auto" ? systemTheme : theme;
}

export default useResolvedTheme;