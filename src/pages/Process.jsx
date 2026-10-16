import CtaBanner from "../components/CtaBanner.jsx";
import { processStepNumbers } from "../data/companyData.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import usePageMeta from "../usePageMeta.js";

export default function Process() {
  const { t } = useLanguage();
  const content = t("process");
  usePageMeta("process.meta.title", "process.meta.description");

  return (
    <main>
      <header className="page-hero">
        <div className="hero-glow hero-glow-two"></div>
        <div className="container text-center position-relative" data-aos="fade-up">
          <span className="eyebrow">{content.hero.eyebrow}</span>
          <h1>{content.hero.heading}</h1>
          <p>{content.hero.description}</p>
        </div>
      </header>
      <section className="section-pad">
        <div className="container">
          <div className="row g-4 company-process-grid">
            {content.steps.map((step, index) => (
              <div className="company-process-column" data-aos="fade-up" data-aos-delay={index * 75} key={processStepNumbers[index]}>
                <article className="glass-panel company-process-card">
                  <span className="gradient-text company-process-number">{processStepNumbers[index]}</span>
                  <h2>{step.title}</h2>
                  <p>{step.description}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad company-difference-section">
        <div className="container">
          <div className="company-difference-heading" data-aos="fade-up">
            <span className="eyebrow">{content.difference.label}</span>
            <h2>{content.difference.heading}</h2>
          </div>
          <div className="company-difference-grid">
            {content.difference.items.map((item, index) => (
              <article className="company-difference-card" data-aos="fade-up" data-aos-delay={index * 60} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
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
