import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import AOS from "aos";
import initPageEffects from "../effects/pageEffects.js";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import socialLinks from "../data/socialLinks.js";

const SHOW_ON_ROUTE_CHANGE = false;

function Preloader() {
  const location = useLocation();
  const { t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const initialPath = useRef(location.pathname);

  useEffect(() => {
    setLoaded(false);
    const timer = window.setTimeout(() => setLoaded(true), 300);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!SHOW_ON_ROUTE_CHANGE || location.pathname === initialPath.current) return undefined;
    setLoaded(false);
    const timer = window.setTimeout(() => setLoaded(true), 300);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className={`preloader${loaded ? " loaded" : ""}`} aria-label={t("common.preloader")}>
      <div className="loader-orbit"><span></span><span></span><span></span></div>
    </div>
  );
}

function Navbar() {
  const location = useLocation();
  const { lang, t } = useLanguage();
  const [lightMode, setLightMode] = useState(() => document.body.classList.contains("light-mode"));
  const route = location.pathname;

  useEffect(() => {
    const navbar = document.querySelector(".tech-navbar");
    const navbarCollapse = document.querySelector("#mainNav");
    const handleScroll = () => navbar?.classList.toggle("scrolled", window.scrollY > 24);
    const handleMenuOpen = () => navbar?.classList.add("menu-open");
    const handleMenuClose = () => navbar?.classList.remove("menu-open");

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    navbarCollapse?.addEventListener("show.bs.collapse", handleMenuOpen);
    navbarCollapse?.addEventListener("hidden.bs.collapse", handleMenuClose);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      navbarCollapse?.removeEventListener("show.bs.collapse", handleMenuOpen);
      navbarCollapse?.removeEventListener("hidden.bs.collapse", handleMenuClose);
    };
  }, []);

  function toggleTheme() {
    document.body.classList.toggle("light-mode");
    const nextTheme = document.body.classList.contains("light-mode") ? "light" : "dark";
    localStorage.setItem("b355-theme", nextTheme);
    setLightMode(nextTheme === "light");
  }

  function closeMenu() {
    const navbarCollapse = document.querySelector("#mainNav");
    if (navbarCollapse?.classList.contains("show")) {
      document.querySelector('.navbar-toggler[data-bs-target="#mainNav"]')?.click();
    }
  }

  return (
    <nav className="navbar navbar-expand-lg fixed-top tech-navbar" aria-label={t("nav.primaryLabel")}>
      <div className="container">
        <Link className="navbar-brand" to="/" aria-label={t("nav.homeLabel")} onClick={closeMenu}>
          <img className="logo-dark-mode" src="/assets/img/logo-white.png" alt={t("common.logoAlt")} />
          <img className="logo-light-mode" src="/assets/img/logo-black.png" alt="" aria-hidden="true" />
        </Link>
        <div className="d-flex align-items-center gap-2 order-lg-3">
          <LanguageSwitcher />
          <button className="theme-toggle" type="button" aria-label={t("nav.themeToggle")} onClick={toggleTheme}>
            <i className={`fa-solid ${lightMode ? "fa-sun" : "fa-moon"}`}></i>
          </button>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label={t("nav.navigationToggle")}>
            <span></span><span></span><span></span>
          </button>
        </div>
        <div className="collapse navbar-collapse order-lg-2" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item"><Link className={`nav-link${route === "/" ? " active" : ""}`} to="/" onClick={closeMenu}>{t("nav.home")}</Link></li>
            <li className="nav-item"><Link className={`nav-link${route === "/services" ? " active" : ""}`} to="/services" onClick={closeMenu}>{t("nav.services")}</Link></li>
            <li className="nav-item"><Link className={`nav-link${route === "/about" ? " active" : ""}`} to="/about" onClick={closeMenu}>{t("nav.about")}</Link></li>
            <li className="nav-item"><Link className={`nav-link${route === "/industries" ? " active" : ""}`} to="/industries" onClick={closeMenu}>{t("nav.industries")}</Link></li>
            <li className="nav-item"><Link className={`nav-link${route === "/process" ? " active" : ""}`} to="/process" onClick={closeMenu}>{t("nav.process")}</Link></li>
            <li className="nav-item"><Link className={`nav-link${route === "/contact" ? " active" : ""}`} to="/contact" onClick={closeMenu}>{t("nav.contact")}</Link></li>
            <li className="nav-item ms-lg-3"><Link className="btn btn-primary nav-cta" to={route === "/contact" ? "#contactForm" : "/contact"} onClick={closeMenu}>{t("nav.talk")}<ArrowUpRight size={18} className="ms-1" aria-hidden="true" /></Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <Link className="footer-brand" to="/">
              <img className="logo-dark-mode" src="/assets/img/logo-white.png" alt={t("common.logoAlt")} />
              <img className="logo-light-mode" src="/assets/img/logo-black.png" alt="" aria-hidden="true" />
            </Link>
            <p>{t("footer.description")}</p>
            <div className="social-links">
              {socialLinks.filter(({ url }) => url).map(({ id, labelKey, iconClass, url }) => (
                <a href={url} target="_blank" rel="noopener noreferrer" aria-label={t(labelKey)} key={id}><i className={iconClass}></i></a>
              ))}
            </div>
          </div>
          <div className="col-6 col-lg-2">
            <h3>{t("footer.pagesHeading")}</h3>
            <Link to="/services">{t("nav.services")}</Link>
            <Link to="/about">{t("nav.about")}</Link>
            <Link to="/industries">{t("nav.industries")}</Link>
            <Link to="/process">{t("nav.process")}</Link>
            <Link to="/contact">{t("nav.contact")}</Link>
          </div>
          <div className="col-6 col-lg-3">
            <h3>{t("footer.servicesHeading")}</h3>
            <Link to="/services">{t("footer.websiteDevelopment")}</Link>
            <Link to="/services">{t("footer.mobileAppDevelopment")}</Link>
            <Link to="/services">{t("footer.websiteSecurity")}</Link>
          </div>
          <div className="col-lg-3">
            <h3>{t("footer.newsletterHeading")}</h3>
            <form className="newsletter-form">
              <input type="email" placeholder={t("footer.newsletterPlaceholder")} aria-label={t("footer.newsletterPlaceholder")} required />
              <button type="submit" aria-label={t("footer.subscribe")}><i className="fa-solid fa-paper-plane"></i></button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">{t("footer.copyright")}</div>
      </div>
    </footer>
  );
}

function BackToTop() {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 520);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button className={`back-to-top${show ? " show" : ""}`} type="button" aria-label={t("common.backToTop")} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      <i className="fa-solid fa-arrow-up"></i>
    </button>
  );
}

export default function Layout() {
  const location = useLocation();
  const { lang, t } = useLanguage();
  const previousLanguage = useRef(lang);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const cleanup = initPageEffects(t);
    AOS.refreshHard();
    return cleanup;
  }, [location.pathname, lang, t]);

  useEffect(() => {
    if (previousLanguage.current === lang) return;
    previousLanguage.current = lang;
    AOS.refresh();
  }, [lang]);

  return (
    <>
      <Preloader />
      <Navbar />
      <Outlet />
      <Footer />
      <BackToTop />
    </>
  );
}