document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      document.body.classList.toggle("nav-open", !isOpen);
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      }
    });
  }

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-site-nav] a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const progressBar = document.querySelector("[data-scroll-progress]");
  const updateProgress = () => {
    if (!progressBar) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  const revealNodes = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealNodes.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  }

  const sectionLinks = Array.from(document.querySelectorAll("[data-site-nav] a[href^='#']"));
  const observedSections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        sectionLinks.forEach((link) => {
          link.dataset.activeSection = String(link.getAttribute("href") === `#${visible.target.id}`);
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.08, 0.2, 0.45] }
    );
    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  document.querySelectorAll("[data-preview-tabs]").forEach((tabs) => {
    const buttons = tabs.querySelectorAll("[data-preview-target]");
    const panels = tabs.querySelectorAll(".preview-panel");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.dataset.previewTarget;
        buttons.forEach((item) => {
          item.setAttribute("aria-selected", String(item === button));
        });
        panels.forEach((panel) => {
          panel.classList.toggle("is-active", panel.id === targetId);
        });
      });
    });
  });

  document.querySelectorAll("[data-faq]").forEach((faq) => {
    faq.addEventListener("toggle", (event) => {
      if (!(event.target instanceof HTMLDetailsElement) || !event.target.open) return;
      faq.querySelectorAll("details").forEach((item) => {
        if (item !== event.target) item.open = false;
      });
    }, true);
  });

  const showToast = (() => {
    let toast;
    let timer;
    return (message) => {
      if (!toast) {
        toast = document.createElement("div");
        toast.className = "site-toast";
        toast.setAttribute("role", "status");
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add("is-visible");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
    };
  })();

  document.querySelectorAll("[data-download-button]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast("Los enlaces oficiales de descarga se anadiran cuando la publicacion este lista.");
    });
  });

  document.querySelectorAll("[data-language-select]").forEach((select) => {
    const panel = document.querySelector("[data-language-panel]");
    select.addEventListener("change", () => {
      if (!panel) return;
      panel.hidden = !select.value;
    });
  });

  document.querySelectorAll("[data-coming-soon]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast("Proximamente");
    });
  });
});
