import { useEffect, useRef, useState } from "react";

function useReveal({ revealOnMount = false, threshold = 0.35 } = {}) {
  const elementRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    if (revealOnMount) {
      let firstFrame;
      let secondFrame;
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => setIsRevealed(true));
      });
      return () => {
        window.cancelAnimationFrame(firstFrame);
        if (secondFrame !== undefined) window.cancelAnimationFrame(secondFrame);
      };
    }

    if (!window.IntersectionObserver) {
      setIsRevealed(true);
      return undefined;
    }

    let hasRevealed = false;
    const observer = new IntersectionObserver((entries) => {
      if (hasRevealed || !entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= threshold)) return;
      hasRevealed = true;
      setIsRevealed(true);
      observer.unobserve(element);
    }, { threshold });

    observer.observe(element);
    return () => observer.disconnect();
  }, [revealOnMount, threshold]);

  return { elementRef, isRevealed };
}

export default useReveal;