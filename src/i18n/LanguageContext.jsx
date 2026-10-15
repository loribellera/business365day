import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "./en.js";
import fr from "./fr.js";
import es from "./es.js";

const LanguageContext = createContext(null);
const dictionaries = { en, fr, es };
const languages = [
  { code: "en", label: "English", short: "EN" },
  { code: "fr", label: "Français", short: "FR" },
  { code: "es", label: "Español", short: "ES" }
];

function detectInitialLanguage() {
  try {
    const saved = window.localStorage.getItem("b365-lang");
    if (languages.some(({ code }) => code === saved)) return saved;
  } catch {}

  const browserLanguage = typeof navigator !== "undefined" ? navigator.language?.toLowerCase() : "";
  if (browserLanguage.startsWith("fr")) return "fr";
  if (browserLanguage.startsWith("es")) return "es";
  return "en";
}

function readPath(source, path) {
  return path.split(".").reduce((value, key) => value?.[key], source);
}

export function LanguageProvider({ children }) {
  const [lang, setLanguageState] = useState(detectInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((nextLanguage) => {
    if (!languages.some(({ code }) => code === nextLanguage)) return;
    try {
      window.localStorage.setItem("b365-lang", nextLanguage);
    } catch {}
    document.documentElement.lang = nextLanguage;
    setLanguageState(nextLanguage);
  }, []);

  const t = useCallback((key) => {
    const translated = readPath(dictionaries[lang], key);
    if (translated !== undefined) return translated;
    const english = readPath(en, key);
    return english !== undefined ? english : key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t, languages }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
