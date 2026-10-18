import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Cctv, Check, CodeXml, HouseWifi, ShieldCheck, Smartphone } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import usePageMeta from "../usePageMeta.js";

const homeServiceIcons = [CodeXml, Smartphone, HouseWifi, ShieldCheck, Cctv];

export default function Home() {
  const carouselRef = useRef(null);
  const { t } = useLanguage();
  const home = t("home");

  usePageMeta("home.meta.title", "home.meta.description");

  useEffect(() => {
    const carousel = carouselRef.current && window.bootstrap?.Carousel.getOrCreateInstance(carouselRef.current);
    return () => carousel?.dispose();
  }, []);

  return (
    <main>
      <section className="hero-section min-vh-100 d-flex align-items-center overflow-hidden">
        <div className="hero-glow hero-glow-one"></div>
        <div className="hero-glow hero-glow-two"></div>
        <div className="container position-relative">
          <div className="row align-items-center g-5">
            <div className="col-lg-6" data-aos="fade-up">
              <span className="eyebrow">{home.hero.eyebrow}</span>
              <h1 className="display-3 fw-black mt-3">{home.hero.heading} <span className="gradient-text typed-text" data-words={home.hero.words.join(",")}>{home.hero.words[0]}</span></h1>
              <p className="hero-copy mt-4">{home.hero.description}</p>
              <div className="d-flex flex-wrap gap-3 mt-5">
                <Link className="btn btn-primary btn-lg magnetic-btn" to="/services">{home.hero.exploreServices} <i className="fa-solid fa-arrow-right ms-2"></i></Link>
                <Link className="btn btn-outline-light btn-lg glass-btn" to="/contact">{home.hero.contact}<ArrowUpRight size={18} className="ms-1" aria-hidden="true" /></Link>
              </div>
              <div className="hero-checks mt-5" data-aos="fade-up" data-aos-delay="250">
                {home.hero.checks.map((text) => (
                  <div className="hero-check" key={text}>
                    <span className="check-mark"><Check size={16} strokeWidth={2.5} /></span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6" data-aos="zoom-in" data-aos-delay="150">
              <div className="hero-device parallax-card">
                <div className="device-toolbar">
                  <span></span><span></span><span></span>
                  <small>{home.device.studioLabel}</small>
                </div>
                <div className="device-grid">
                  <div className="glass-panel large-panel">
                    <span className="mini-label">{home.device.miniLabel}</span>
                    <h2>{home.device.heading}</h2>
                    <p>{home.device.description}</p>
                    <div className="metric-row">
                      <div><strong className="counter" data-target="98">0</strong><span>{home.device.performance}</span></div>
                      <div><strong className="counter" data-target="365">0</strong><span>{home.device.support}</span></div>
                    </div>
                  </div>
                  <div className="visual-tile image-tile"></div>
                  <div className="glass-panel small-panel">
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>{home.device.security}</span>
                  </div>
                  <div className="glass-panel small-panel accent-panel">
                    <HouseWifi size={20} strokeWidth={2} aria-hidden="true" />
                    <span>{home.device.smartHome}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="section-heading text-center mx-auto" data-aos="fade-up">
            <span className="eyebrow">{home.services.eyebrow}</span>
            <h2>{home.services.heading}</h2>
            <p>{home.services.description}</p>
          </div>
          <div className="row g-4 mt-4 home-service-cards">
            {home.services.cards.map((card, index) => {
              const Icon = homeServiceIcons[index];
              return (
                <div className="col-md-6 col-xl-4" data-aos="fade-up" data-aos-delay={index * 100 || undefined} key={card.title}>
                  <article className="service-card h-100">
                    <div className="home-service-icon"><Icon size={24} strokeWidth={2} aria-hidden="true" /></div>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad alt-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6" data-aos="fade-right">
              <div className="stacked-visual">
                <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=80" alt={home.why.imageAlt} />
                <div className="floating-badge">
                  <i className="fa-solid fa-bolt"></i>
                  <span>{home.why.badge}</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <span className="eyebrow">{home.why.eyebrow}</span>
              <h2 className="section-title">{home.why.heading}</h2>
              <div className="feature-list mt-4">
                {home.why.features.map((feature) => <div key={feature}><i className="fa-solid fa-check"></i><span>{feature}</span></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="container">
          <div className="row g-4 text-center">
            {home.stats.map((label, index) => <div className="col-6 col-lg-3" data-aos="fade-up" data-aos-delay={index * 100 || undefined} key={label}><strong className="counter" data-target={[120, 45, 99, 24][index]}>0</strong><span>{label}</span></div>)}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3" data-aos="fade-up">
            <div className="section-heading text-lg-start">
              <span className="eyebrow">{home.featured.eyebrow}</span>
              <h2>{home.featured.heading}</h2>
            </div>
            <Link className="link-arrow" to="/contact">{home.featured.discuss} <i className="fa-solid fa-arrow-right"></i></Link>
          </div>
          <div className="row g-4 mt-3">
            {home.featured.projects.map((project, index) => (
              <div className="col-lg-4" data-aos="zoom-in" data-aos-delay={index * 100 || undefined} key={project.title}>
                <article className="project-card">
                  <img src={["https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80"][index]} alt={project.imageAlt} />
                  <div><span>{project.category}</span><h3>{project.title}</h3></div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad alt-section">
        <div className="container">
          <div className="section-heading text-center mx-auto" data-aos="fade-up">
            <span className="eyebrow">{home.testimonials.eyebrow}</span>
            <h2>{home.testimonials.heading}</h2>
          </div>
          <div ref={carouselRef} id="testimonialCarousel" className="carousel slide testimonial-carousel mt-5" data-bs-ride="carousel" data-aos="fade-up">
            <div className="carousel-inner">
              {home.testimonials.items.map((testimonial, index) => (
                <div className={`carousel-item${index === 0 ? " active" : ""}`} key={testimonial.author}>
                  <blockquote>{testimonial.quote}</blockquote>
                  <div className="testimonial-author">{testimonial.author} <span>{testimonial.role}</span></div>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev" aria-label={home.testimonials.previous}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next" aria-label={home.testimonials.next}>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="cta-banner" data-aos="zoom-in">
            <div>
              <span className="eyebrow">{home.finalCta.eyebrow}</span>
              <h2>{home.finalCta.heading}</h2>
            </div>
            <Link className="btn btn-light btn-lg magnetic-btn" to="/contact">{home.finalCta.button} <i className="fa-solid fa-arrow-right ms-2"></i></Link>
          </div>
        </div>
      </section>
    </main>
  );
}