import usePageMeta from "../usePageMeta.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function About() {
  const { t } = useLanguage();
  const content = t("about");
  usePageMeta("about.meta.title", "about.meta.description");

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
          <div className="row align-items-center g-5">
            <div className="col-lg-6" data-aos="fade-right">
              <span className="eyebrow">{content.story.eyebrow}</span>
              <h2 className="section-title">{content.story.heading}</h2>
              <p className="lead-text">{content.story.description}</p>
              <p>{content.story.approach}</p>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="about-visual">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80" alt={content.story.imageAlt} />
                <div className="about-card glass-panel">
                  <strong>365</strong>
                  <span>{content.story.badge}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad alt-section">
        <div className="container">
          <div className="about-mission-panel" data-aos="fade-up">
            <div className="about-mission-content">
              <div className="about-mission-copy">
                <h2>{content.mission.heading}</h2>
                <p>{content.mission.text}</p>
              </div>
              <div className="about-vision-copy">
                <h2>{content.vision.heading}</h2>
                <p>{content.vision.text}</p>
              </div>
              <div className="about-values-grid">
                {content.values.map((value) => (
                  <article className="about-value-tile" key={value.title}>
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="section-heading text-center mx-auto" data-aos="fade-up">
            <span className="eyebrow">{content.team.eyebrow}</span>
            <h2>{content.team.heading}</h2>
          </div>
          <div className="row g-4 mt-3">
            {content.team.members.map((member, index) => (
              <div className="col-md-4" data-aos="zoom-in" data-aos-delay={index * 100 || undefined} key={member.name}>
              <article className="team-card">
                <img src={["https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"][index]} alt={member.imageAlt} />
                <h3>{member.name}</h3><span>{member.role}</span>
              </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad alt-section">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <span className="eyebrow">{content.milestones.eyebrow}</span>
              <h2 className="section-title">{content.milestones.heading}</h2>
              <div className="timeline">
                {content.milestones.items.map((item) => <div key={item.year}><span>{item.year}</span><p>{item.description}</p></div>)}
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="skills-panel">
                <h3>{content.strengths.heading}</h3>
                {content.strengths.labels.map((label, index) => <div className="skill" key={label}><span>{label}</span><div className="progress"><div className="progress-bar" data-width={[96, 92, 90, 94][index]}></div></div></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}