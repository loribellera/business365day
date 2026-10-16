import { useEffect, useRef } from "react";
import CtaBanner from "../components/CtaBanner.jsx";
import StarMark from "../components/StarMark.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import usePageMeta from "../usePageMeta.js";

export default function Industries() {
  const gridRef = useRef(null);
  const { t } = useLanguage();
  const content = t("industries");

  usePageMeta("industries.meta.title", "industries.meta.description");

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    let timer;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          timer = setTimeout(() => el.classList.add("is-visible"), 250);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <main>
      <header className="page-hero">
        <div className="hero-glow hero-glow-one"></div>
        <div className="container text-center position-relative" data-aos="fade-up">
          <span className="eyebrow">{content.hero.eyebrow}</span>
          <h1>{content.hero.heading}</h1>
          <p>{content.hero.description}</p>
        </div>
      </header>

      <section className="section-pad industries-section">
        <div className="container">
          <div className="section-heading text-center mx-auto" data-aos="fade-up">
            <span className="eyebrow">{content.section.eyebrow}</span>
            <h2>{content.section.heading}</h2>
          </div>
          <div className="industry-grid mt-4" ref={gridRef}>
            {content.items.map((industry, index) => (
              <div className="industry-cell" key={industry} style={{ "--i": index, "--f": ((index % 4) * 0.35) + "s" }}>
                <div className="industry-tile"><StarMark /><span>{industry}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <CtaBanner />
        </div>
      </section>
    </main>
  );
}
