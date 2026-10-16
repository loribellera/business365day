import { Link } from "react-router-dom";
import CtaBanner from "../components/CtaBanner.jsx";
import servicesData, { Check, smartBanner } from "../data/servicesData.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import usePageMeta from "../usePageMeta.js";

export default function Services() {
  const { t } = useLanguage();
  const content = t("services");
  usePageMeta("services.meta.title", "services.meta.description");

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

      <section className="section-pad">
        <div className="container">
          <div className="row g-4 services-card-grid">
            {servicesData.map(({ icon: Icon, delay }, index) => {
              const card = content.cards[index];
              return <div className="col-md-6 col-xl-4" data-aos="fade-up" {...(delay ? { "data-aos-delay": delay } : {})} key={card.title}>
                <article className="deep-service-card">
                  <div className="service-icon"><Icon size={22.4} strokeWidth={2} color="var(--text)" /></div>
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                  <ul className="service-card-bullets">
                    {card.bullets.map((bullet) => (
                      <li key={bullet}><Check size={14} strokeWidth={2.5} color="var(--secondary)" />{bullet}</li>
                    ))}
                  </ul>
                  <Link className="btn btn-outline-light" to="/contact">{content.learnMore}</Link>
                </article>
              </div>;
            })}
          </div>
          <div className="smart-home-banner mt-4" data-aos="fade-up">
            <div className="smart-home-banner-content">
              <span className="eyebrow">{content.smartBanner.label}</span>
              <h2>{content.smartBanner.heading}</h2>
              <p>{content.smartBanner.paragraph}</p>
              <div className="smart-home-banner-tags">
                {content.smartBanner.tags.map((tag) => (
                  <span className="smart-home-banner-tag" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <Link className="btn btn-primary smart-home-banner-button" to="/contact">
              {content.smartBanner.button}<smartBanner.icon size={18} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad alt-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5" data-aos="fade-right">
              <span className="eyebrow">{content.process.eyebrow}</span>
              <h2 className="section-title">{content.process.heading}</h2>
            </div>
            <div className="col-lg-7" data-aos="fade-left">
              <div className="process-grid">
                {content.process.steps.map((step) => <div key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></div>)}
              </div>
            </div>
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