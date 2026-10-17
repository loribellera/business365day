import AOS from "aos";

export default function initPageEffects(t) {
  const timers = new Set();
  const animationFrames = new Set();
  const listeners = [];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounters(entry.target);
      animateProgress(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  AOS.init({
    duration: 850,
    once: true,
    offset: 90,
    easing: "ease-out-cubic"
  });

  function setTimer(callback, delay) {
    const timer = window.setTimeout(() => {
      timers.delete(timer);
      callback();
    }, delay);
    timers.add(timer);
    return timer;
  }

  function addListener(element, eventName, handler) {
    element.addEventListener(eventName, handler);
    listeners.push(() => element.removeEventListener(eventName, handler));
  }

  document.querySelectorAll(".counter, .skills-panel").forEach((item) => observer.observe(item));

  function animateCounters(scope) {
    const counters = scope.classList?.contains("counter") ? [scope] : scope.querySelectorAll(".counter");
    counters.forEach((counter) => {
      const target = Number(counter.dataset.target || 0);
      const suffix = target === 99 || target === 98 ? "%" : target === 24 ? "/7" : "+";
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `${Math.round(target * eased)}${progress === 1 ? suffix : ""}`;
        if (progress < 1) {
          const frame = requestAnimationFrame((time) => {
            animationFrames.delete(frame);
            tick(time);
          });
          animationFrames.add(frame);
        }
      }

      const frame = requestAnimationFrame((time) => {
        animationFrames.delete(frame);
        tick(time);
      });
      animationFrames.add(frame);
    });
  }

  function animateProgress(scope) {
    const bars = scope.querySelectorAll?.(".progress-bar") || [];
    bars.forEach((bar) => {
      bar.style.width = `${bar.dataset.width || 0}%`;
    });
  }

  const typed = document.querySelector(".typed-text");
  if (typed) {
    const words = typed.dataset.words.split(",").map((word) => word.trim());
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const word = words[wordIndex];
      typed.textContent = word.slice(0, charIndex);

      if (!deleting && charIndex < word.length) {
        charIndex += 1;
        setTimer(typeLoop, 85);
      } else if (!deleting) {
        deleting = true;
        setTimer(typeLoop, 1200);
      } else if (charIndex > 0) {
        charIndex -= 1;
        setTimer(typeLoop, 45);
      } else {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimer(typeLoop, 180);
      }
    }

    typeLoop();
  }

  document.querySelectorAll(".parallax-card").forEach((card) => {
    addListener(card, "mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1100px) rotateY(${x * -12}deg) rotateX(${y * 10}deg) translateY(-4px)`;
    });
    addListener(card, "mouseleave", () => {
      card.style.transform = "";
    });
  });

  document.querySelectorAll(".magnetic-btn").forEach((button) => {
    addListener(button, "mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.08}px, ${(event.clientY - rect.top - rect.height / 2) * 0.12}px)`;
    });
    addListener(button, "mouseleave", () => {
      button.style.transform = "";
    });
  });

  document.querySelectorAll(".newsletter-form").forEach((form) => {
    addListener(form, "submit", (event) => {
      event.preventDefault();
      const input = form.querySelector("input");
      if (input) {
        input.value = "";
        input.placeholder = t("footer.newsletterSuccess");
      }
    });
  });

  return () => {
    observer.disconnect();
    listeners.forEach((removeListener) => removeListener());
    timers.forEach((timer) => window.clearTimeout(timer));
    animationFrames.forEach((frame) => cancelAnimationFrame(frame));
  };
}