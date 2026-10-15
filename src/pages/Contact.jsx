import usePageMeta from "../usePageMeta.js";
import { ChevronDown, Mail, MapPin, MapPinned, Phone, Send } from "lucide-react";
import { budgetOptionValues, contactButtons, contactDetails, serviceOptionValues } from "../data/contactData.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const contactIcons = { mail: Mail, phone: Phone, map: MapPin };

export default function Contact() {
  const { t } = useLanguage();
  const content = t("contact");
  usePageMeta("contact.meta.title", "contact.meta.description");

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
          <div className="contact-board" data-aos="fade-up">
            <div className="contact-side">
              <div className="contact-details-list">
                {contactDetails.map((detail) => {
                  const Icon = contactIcons[detail.icon];
                  return (
                    <div className="contact-detail-row" key={detail.label}>
                      <span className="contact-detail-icon"><Icon size={22} strokeWidth={2} /></span>
                      <div className="contact-detail-copy">
                        <span className="contact-detail-label">{content.details[`${detail.id}Label`]}</span>
                        {detail.href ? <a href={detail.href}>{detail.value}</a> : <span className="contact-detail-value">{content.details.studio}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="contact-map-box">
                <MapPinned size={40} strokeWidth={1.8} aria-hidden="true" />
                <h2>{content.map.title}</h2>
                <p>{content.map.text}</p>
              </div>
            </div>

            <div className="contact-form-side">
              <form id="contactForm" className="contact-form">
                <div className="contact-form-grid">
                  <div className="contact-field"><label htmlFor="name">{content.form.fullName.label}</label><input id="name" type="text" className="contact-control" placeholder={content.form.fullName.placeholder} required /></div>
                  <div className="contact-field"><label htmlFor="email">{content.form.email.label}</label><input id="email" type="email" className="contact-control" placeholder={content.form.email.placeholder} required /></div>
                  <div className="contact-field"><label htmlFor="service">{content.form.service.label}</label><div className="select-wrap"><select id="service" className="contact-control" defaultValue=""><option value="">{content.form.service.placeholder}</option>{serviceOptionValues.map((value, index) => <option value={value} key={value}>{content.form.service.options[index]}</option>)}</select><ChevronDown size={18} strokeWidth={2} aria-hidden="true" /></div></div>
                  <div className="contact-field"><label htmlFor="budget">{content.form.budget.label}</label><div className="select-wrap"><select id="budget" className="contact-control" defaultValue={budgetOptionValues[budgetOptionValues.length - 1]}>{budgetOptionValues.map((value, index) => <option value={value} key={value}>{content.form.budget.options[index]}</option>)}</select><ChevronDown size={18} strokeWidth={2} aria-hidden="true" /></div></div>
                  <div className="contact-field contact-field-full"><label htmlFor="message">{content.form.projectDetails.label}</label><textarea id="message" className="contact-control" rows="6" placeholder={content.form.projectDetails.placeholder} required></textarea></div>
                  <div className="contact-form-actions contact-field-full">
                    <button className="btn btn-primary btn-lg magnetic-btn" type="submit">{content.form.send}<Send size={18} strokeWidth={2} aria-hidden="true" /></button>
                    <a className="btn btn-whatsapp btn-lg" href={contactButtons.whatsappHref} target="_blank" rel="noopener"><i className="fa-brands fa-whatsapp me-2"></i>{content.form.whatsapp}</a>
                  </div>
                </div>
                <p className="form-status" aria-live="polite"></p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad alt-section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-5" data-aos="fade-right">
              <span className="eyebrow">{content.faq.eyebrow}</span>
              <h2 className="section-title">{content.faq.heading}</h2>
              <div className="social-links mt-4"><a href="#" aria-label={t("footer.facebook")}><i className="fa-brands fa-facebook-f"></i></a><a href="#" aria-label={t("footer.instagram")}><i className="fa-brands fa-instagram"></i></a><a href="#" aria-label={t("footer.linkedin")}><i className="fa-brands fa-linkedin-in"></i></a><a href="#" aria-label={t("footer.x")}><i className="fa-brands fa-x-twitter"></i></a></div>
            </div>
            <div className="col-lg-7" data-aos="fade-left">
              <div className="accordion faq-accordion" id="faqAccordion">
                {content.faq.items.map((item, index) => {
                  const faqId = `faq${["One", "Two", "Three", "Four"][index]}`;
                  return <div className="accordion-item" key={item.question}><h3 className="accordion-header"><button className={`accordion-button${index === 0 ? "" : " collapsed"}`} type="button" data-bs-toggle="collapse" data-bs-target={`#${faqId}`}>{item.question}</button></h3><div id={faqId} className={`accordion-collapse collapse${index === 0 ? " show" : ""}`} data-bs-parent="#faqAccordion"><div className="accordion-body">{item.answer}</div></div></div>;
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}