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

  const lang = document.documentElement.lang || "es";
  const t = (map) => map[lang] || map.es;

  document.querySelectorAll("[data-download-button]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(t({
        es: "Los enlaces oficiales de descarga se anadiran cuando la publicacion este lista.",
        en: "Official download links will be added once the release is ready.",
        ro: "Linkurile oficiale de descarcare se vor adauga cand lansarea va fi gata.",
        de: "Offizielle Download-Links werden hinzugefügt, sobald die Veröffentlichung bereit ist.",
        fr: "Les liens de téléchargement officiels seront ajoutés dès que la version sera prête.",
        ja: "公式のダウンロードリンクは、リリースの準備が整い次第追加されます。",
        zh: "正式下载链接将在版本发布后添加。"
      }));
    });
  });

  // Name of each deck language expressed in each selectable native language (exonyms).
  const DECK_LANG_NAMES = {
    es: { es: "Español", en: "Inglés", fr: "Francés", de: "Alemán", ro: "Rumano", ja: "Japonés", he: "Hebreo" },
    en: { es: "Spanish", en: "English", fr: "French", de: "German", ro: "Romanian", ja: "Japanese", he: "Hebrew" },
    fr: { es: "Espagnol", en: "Anglais", fr: "Français", de: "Allemand", ro: "Roumain", ja: "Japonais", he: "Hébreu" },
    de: { es: "Spanisch", en: "Englisch", fr: "Französisch", de: "Deutsch", ro: "Rumänisch", ja: "Japanisch", he: "Hebräisch" },
    ro: { es: "Spaniolă", en: "Engleză", fr: "Franceză", de: "Germană", ro: "Română", ja: "Japoneză", he: "Ebraică" },
    ja: { es: "スペイン語", en: "英語", fr: "フランス語", de: "ドイツ語", ro: "ルーマニア語", ja: "日本語", he: "ヘブライ語" },
    he: { es: "ספרדית", en: "אנגלית", fr: "צרפתית", de: "גרמנית", ro: "רומנית", ja: "יפנית", he: "עברית" }
  };

  document.querySelectorAll("[data-language-select]").forEach((select) => {
    const panel = document.querySelector("[data-language-panel]");
    const flags = panel ? panel.querySelectorAll(".flag-button[data-lang]") : [];
    select.addEventListener("change", () => {
      if (!panel) return;
      const native = select.value;
      panel.hidden = !native;
      const names = DECK_LANG_NAMES[native];
      flags.forEach((flag) => {
        const code = flag.dataset.lang;
        // Hide the deck for the user's own native language.
        flag.hidden = Boolean(native) && code === native;
        // Label each remaining deck in the selected native language.
        if (names && names[code]) {
          const label = flag.querySelector("span");
          if (label) label.textContent = names[code];
        }
      });
    });
  });

  document.querySelectorAll("[data-coming-soon]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(t({ es: "Proximamente", en: "Coming soon", ro: "In curand", de: "Demnächst", fr: "Bientôt disponible", ja: "近日公開", zh: "即将推出" }));
    });
  });

  // Language dropdown: open/close, close on outside click / Escape, and persist the
  // manual choice in localStorage so the auto-detection in <head> respects it.
  document.querySelectorAll("[data-lang-menu]").forEach((menu) => {
    const toggle = menu.querySelector("[data-lang-toggle]");
    const list = menu.querySelector(".lang-menu-list");
    if (!toggle || !list) return;
    const close = () => {
      toggle.setAttribute("aria-expanded", "false");
      list.hidden = true;
    };
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      list.hidden = isOpen;
    });
    list.querySelectorAll("a[data-lang]").forEach((link) => {
      link.addEventListener("click", () => {
        try {
          localStorage.setItem("fl-lang", link.dataset.lang);
        } catch (e) {}
      });
    });
    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target)) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  });
});
