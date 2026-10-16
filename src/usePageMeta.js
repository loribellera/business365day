import { useEffect } from "react";
import { useLanguage } from "./i18n/LanguageContext.jsx";

export default function usePageMeta(title, description) {
  const { lang, t } = useLanguage();

  useEffect(() => {
    document.title = t(title);
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.append(meta);
    }
    meta.content = t(description);
  }, [title, description, lang, t]);
}