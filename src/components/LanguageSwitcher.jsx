import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function LanguageSwitcher() {
  const { lang, setLang, t, languages } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const itemRefs = useRef([]);
  const activeLanguage = languages.find((language) => language.code === lang) || languages[0];

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    const focusTimer = window.requestAnimationFrame(() => {
      itemRefs.current[languages.findIndex((language) => language.code === lang)]?.focus();
    });

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      window.cancelAnimationFrame(focusTimer);
    };
  }, [lang, languages, open]);

  function handleMenuKeyDown(event) {
    const currentIndex = itemRefs.current.indexOf(document.activeElement);
    let nextIndex;

    if (event.key === "ArrowDown") nextIndex = (currentIndex + 1 + languages.length) % languages.length;
    else if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + languages.length) % languages.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = languages.length - 1;
    else return;

    event.preventDefault();
    itemRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="language-switcher" ref={rootRef}>
      <button
        className="language-switcher-button"
        type="button"
        ref={buttonRef}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("common.selectLanguage")}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <Globe size={18} aria-hidden="true" />
        <span>{activeLanguage.short}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open && (
        <div className="language-switcher-menu" role="menu" onKeyDown={handleMenuKeyDown}>
          {languages.map((language, index) => (
            <button
              className="language-switcher-option"
              type="button"
              role="menuitemradio"
              aria-checked={lang === language.code}
              ref={(element) => { itemRefs.current[index] = element; }}
              key={language.code}
              onClick={() => {
                setLang(language.code);
                setOpen(false);
                buttonRef.current?.focus();
              }}
            >
              <span>{t(`common.languages.${language.code}`)}</span>
              {lang === language.code && <Check size={16} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
