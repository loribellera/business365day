import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { TURNSTILE_SITE_KEY } from "../config.js";

let turnstileScriptPromise;

function loadTurnstileScript() {
  if (window.turnstile?.render) return Promise.resolve(window.turnstile);
  if (turnstileScriptPromise) return turnstileScriptPromise;

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      turnstileScriptPromise = null;
      reject(new Error("Turnstile script timed out"));
    }, 10000);
    let script = document.querySelector('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", () => {
      window.clearTimeout(timeoutId);
      if (window.turnstile?.render) resolve(window.turnstile);
      else {
        turnstileScriptPromise = null;
        reject(new Error("Turnstile did not initialize"));
      }
    }, { once: true });
    script.addEventListener("error", () => {
      window.clearTimeout(timeoutId);
      turnstileScriptPromise = null;
      reject(new Error("Turnstile script failed to load"));
    }, { once: true });
    if (window.turnstile?.render) resolve(window.turnstile);
  });

  return turnstileScriptPromise;
}

const TurnstileWidget = forwardRef(function TurnstileWidget({ onToken, onError }, ref) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);
  const { lang } = useLanguage();
  const [theme, setTheme] = useState(() => document.body.classList.contains("light-mode") ? "light" : "dark");

  onTokenRef.current = onToken;
  onErrorRef.current = onError;

  useImperativeHandle(ref, () => ({
    reset() {
      if (widgetIdRef.current !== null) window.turnstile?.reset(widgetIdRef.current);
    }
  }), []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.body.classList.contains("light-mode") ? "light" : "dark");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let widgetId = null;

    loadTurnstileScript()
      .then((turnstile) => {
        if (cancelled || !containerRef.current || !turnstile) return;
        widgetId = turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme,
          language: lang,
          callback: (token) => onTokenRef.current(token),
          "error-callback": () => onErrorRef.current?.(),
          "expired-callback": () => onTokenRef.current("")
        });
        widgetIdRef.current = widgetId;
      })
      .catch(() => onErrorRef.current?.());

    return () => {
      cancelled = true;
      if (widgetId !== null) window.turnstile?.remove(widgetId);
      widgetIdRef.current = null;
      onTokenRef.current("");
    };
  }, [lang, theme]);

  return <div className="contact-turnstile" ref={containerRef} />;
});

export default TurnstileWidget;
