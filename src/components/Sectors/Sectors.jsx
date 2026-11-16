import sectors from "../../data/sectors.js";
import useResolvedTheme from "../../hooks/useResolvedTheme.js";
import useReveal from "../../hooks/useReveal.js";
import "./Sectors.css";

const assetUrl = (filename) => `${import.meta.env.BASE_URL}assets/img/${filename}`;

function SectorBlock({ sector, index, theme }) {
  const { elementRef, isRevealed } = useReveal({ revealOnMount: index === 0 });
  const useInvertedLogo = sector.id === "smart-housing" && theme === "light";
  const logoFile = sector.id === "smart-housing"
    ? sector.imgLight
    : theme === "light" ? sector.img : sector.imgLight;

  return (
    <section
      className={`sx-block${index === 0 ? " sx-block--first" : ""}${isRevealed ? " is-in" : ""}`}
      id={sector.id}
      aria-label={`${sector.name} sector`}
      ref={elementRef}
    >
      <img
        className={`sx-logo${useInvertedLogo ? " sx-logo--inverted" : ""}`}
        src={assetUrl(logoFile)}
        alt={`Business365Days ${sector.name}`}
        width={sector.width}
        height={sector.height}
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        onError={(event) => {
          const fallback = assetUrl(sector.imgLight);
          if (event.currentTarget.src !== new URL(fallback, window.location.href).href) event.currentTarget.src = fallback;
        }}
      />
      <div className="sx-copy">
        <h2>{sector.headline}</h2>
        <p>{sector.summary}</p>
        <ul>
          {sector.services.map((service) => <li key={service}>{service}</li>)}
        </ul>
      </div>
    </section>
  );
}

export default function Sectors({ theme = "dark", topOffset = "110px" }) {
  const resolvedTheme = useResolvedTheme(theme);

  return (
    <div className="sx" data-theme={resolvedTheme} style={{ "--sx-top": topOffset }}>
      {sectors.map((sector, index) => (
        <SectorBlock key={sector.id} sector={sector} index={index} theme={resolvedTheme} />
      ))}
    </div>
  );
}