import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function CtaBanner() {
  const { t } = useLanguage();

  return (
    <div className="cta-panel" data-aos="zoom-in">
      <div className="cta-panel-copy">
        <h2>{t("cta.heading")}</h2>
        <p>{t("cta.paragraph")}</p>
      </div>
      <Link className="btn btn-primary cta-panel-button" to="/contact">
        {t("cta.button")}<ArrowUpRight size={18} aria-hidden="true" />
      </Link>
    </div>
  );
}
