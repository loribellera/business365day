document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navbar = document.querySelector(".tech-navbar");
  const preloader = document.querySelector(".preloader");
  const backToTop = document.querySelector(".back-to-top");
  const themeToggle = document.querySelector(".theme-toggle");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  setTimeout(() => preloader?.classList.add("loaded"), 650);

  if (window.AOS) {
    AOS.init({
      duration: 850,
      once: true,
      offset: 90,
      easing: "ease-out-cubic"
    });
  }

  const savedTheme = localStorage.getItem("b355-theme");
  if (savedTheme === "light") body.classList.add("light-mode");
  updateThemeIcon();

  themeToggle?.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    localStorage.setItem("b355-theme", body.classList.contains("light-mode") ? "light" : "dark");
    updateThemeIcon();
  });

  function updateThemeIcon() {
    const icon = themeToggle?.querySelector("i");
    if (!icon) return;
    icon.className = body.classList.contains("light-mode") ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  function handleScroll() {
    const scrolled = window.scrollY > 24;
    navbar?.classList.toggle("scrolled", scrolled);
    backToTop?.classList.toggle("show", window.scrollY > 520);
  }

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });

  navbarCollapse?.addEventListener("show.bs.collapse", () => navbar?.classList.add("menu-open"));
  navbarCollapse?.addEventListener("hidden.bs.collapse", () => navbar?.classList.remove("menu-open"));

  document.querySelectorAll(".nav-link, .nav-cta").forEach((link) => {
    link.addEventListener("click", () => {
      if (navbarCollapse?.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
      }
    });
  });

  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounters(entry.target);
      animateProgress(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

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
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
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
        setTimeout(typeLoop, 85);
      } else if (!deleting) {
        deleting = true;
        setTimeout(typeLoop, 1200);
      } else if (charIndex > 0) {
        charIndex -= 1;
        setTimeout(typeLoop, 45);
      } else {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeLoop, 180);
      }
    }

    typeLoop();
  }

  document.querySelectorAll(".parallax-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1100px) rotateY(${x * -12}deg) rotateX(${y * 10}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  document.querySelectorAll(".magnetic-btn").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.08}px, ${(event.clientY - rect.top - rect.height / 2) * 0.12}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });

  document.querySelectorAll(".newsletter-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector("input");
      if (input) {
        input.value = "";
        input.placeholder = "Subscribed. Welcome aboard.";
      }
    });
  });

  document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = event.currentTarget.querySelector(".form-status");
    if (status) status.textContent = "Message ready. Connect this form to your backend or email service to receive submissions.";
    event.currentTarget.reset();
  });
});
