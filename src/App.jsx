import { Link, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import About from "./pages/About.jsx";
import Industries from "./pages/Industries.jsx";
import Process from "./pages/Process.jsx";
import Contact from "./pages/Contact.jsx";
import usePageMeta from "./usePageMeta.js";
import { useLanguage } from "./i18n/LanguageContext.jsx";

function NotFound() {
  const { t } = useLanguage();
  usePageMeta("meta.notFoundTitle", "meta.notFoundDescription");
  return (
    <main className="page-hero">
      <div className="container text-center position-relative">
        <h1>{t("notFound.heading")}</h1>
        <Link className="btn btn-primary" to="/">{t("notFound.home")}</Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="about" element={<About />} />
        <Route path="industries" element={<Industries />} />
        <Route path="process" element={<Process />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}