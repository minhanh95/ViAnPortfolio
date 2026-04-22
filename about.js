const LANGUAGE_STORAGE_KEY = "vanlab-language";

const aboutI18n = {
  vi: {
    pageTitle: "VAN.LAB - Giới thiệu",
    brandTagline: "Artist Portfolio - Art Direction, Product Thinking, Spatial Storytelling",
    viewGallery: "Feature",
    viewIndex: "Danh mục",
    navAbout: "Giới thiệu",
    heroTitle: "Hồ sơ năng lực",
    themeToggleLabel: "Đổi giao diện",
    themeDarkShort: "Tối",
    themeLightShort: "Sáng",
  },
  en: {
    pageTitle: "VAN.LAB - About",
    brandTagline: "Artist Portfolio - Art Direction, Product Thinking, Spatial Storytelling",
    viewGallery: "Feature",
    viewIndex: "Index",
    navAbout: "About",
    heroTitle: "Professional Profile",
    themeToggleLabel: "Switch theme",
    themeDarkShort: "Dark",
    themeLightShort: "Light",
  },
};

const aboutEls = {
  brandHomeLink: document.getElementById("brandHomeLink"),
  brandTagline: document.getElementById("brandTagline"),
  viewGalleryBtn: document.getElementById("viewGalleryBtn"),
  viewIndexBtn: document.getElementById("viewIndexBtn"),
  navAbout: document.getElementById("navAbout"),
  heroTitle: document.getElementById("heroTitle"),
  langViBtn: document.getElementById("langViBtn"),
  langEnBtn: document.getElementById("langEnBtn"),
  themeToggleBtn: document.getElementById("themeToggleBtn"),
};

function getInitialLanguage() {
  const query = new URLSearchParams(window.location.search);
  const queryLang = query.get("lang");
  if (queryLang === "vi" || queryLang === "en") return queryLang;
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === "vi" || stored === "en") return stored;
  return "en";
}

function setText(node, value) {
  if (node) node.textContent = value;
}

function updateHeaderLinks(language) {
  const theme = window.VANLAB_THEME ? window.VANLAB_THEME.get() : "light";
  if (aboutEls.brandHomeLink) {
    aboutEls.brandHomeLink.href = `./index.html?lang=${language}&theme=${theme}`;
  }
  if (aboutEls.viewGalleryBtn) {
    aboutEls.viewGalleryBtn.href = `./index.html?lang=${language}&theme=${theme}`;
  }
  if (aboutEls.viewIndexBtn) {
    aboutEls.viewIndexBtn.href = `./projects.html?lang=${language}&theme=${theme}`;
  }
  if (aboutEls.navAbout) {
    aboutEls.navAbout.href = `./about.html?lang=${language}&theme=${theme}`;
  }
}

function updateThemeToggleUi(language) {
  if (!aboutEls.themeToggleBtn || !window.VANLAB_THEME) return;
  const dict = aboutI18n[language] || aboutI18n.en;
  aboutEls.themeToggleBtn.textContent = "";
  aboutEls.themeToggleBtn.title = dict.themeToggleLabel;
  aboutEls.themeToggleBtn.setAttribute("aria-label", dict.themeToggleLabel);
}

function applyLanguage(language) {
  const dict = aboutI18n[language] || aboutI18n.en;
  document.documentElement.lang = language;
  document.title = dict.pageTitle;
  setText(aboutEls.brandTagline, dict.brandTagline);
  setText(aboutEls.viewGalleryBtn, dict.viewGallery);
  setText(aboutEls.viewIndexBtn, dict.viewIndex);
  setText(aboutEls.navAbout, dict.navAbout);
  setText(aboutEls.heroTitle, dict.heroTitle);

  aboutEls.langViBtn?.classList.toggle("active", language === "vi");
  aboutEls.langEnBtn?.classList.toggle("active", language === "en");
  updateHeaderLinks(language);
  updateThemeToggleUi(language);
}

function initializeAboutPage() {
  let currentLanguage = getInitialLanguage();

  function switchLanguage(language) {
    currentLanguage = language;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    applyLanguage(language);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    if (window.VANLAB_THEME) {
      url.searchParams.set("theme", window.VANLAB_THEME.get());
    }
    window.history.replaceState(window.history.state, "", url.toString());
  }

  localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  applyLanguage(currentLanguage);

  aboutEls.langViBtn?.addEventListener("click", () => switchLanguage("vi"));
  aboutEls.langEnBtn?.addEventListener("click", () => switchLanguage("en"));
  aboutEls.themeToggleBtn?.addEventListener("click", () => {
    window.VANLAB_THEME?.toggle({ syncUrl: true });
  });
  window.addEventListener("vanlab-themechange", () => applyLanguage(currentLanguage));
}

initializeAboutPage();

