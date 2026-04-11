const LANGUAGE_STORAGE_KEY = "vanlab-language";

const aboutI18n = {
  vi: {
    pageTitle: "VAN.LAB - Gioi thieu",
    brandTagline: "Artist Portfolio - Art Direction, Product Thinking, Spatial Storytelling",
    viewGallery: "Gallery",
    viewIndex: "Index",
    navAbout: "About",
    heroTitle: "Slogan",
  },
  en: {
    pageTitle: "VAN.LAB - About",
    brandTagline: "Artist Portfolio - Art Direction, Product Thinking, Spatial Storytelling",
    viewGallery: "Gallery",
    viewIndex: "Index",
    navAbout: "About",
    heroTitle: "Slogan",
  },
};

const aboutEls = {
  brandTagline: document.getElementById("brandTagline"),
  viewGalleryBtn: document.getElementById("viewGalleryBtn"),
  viewIndexBtn: document.getElementById("viewIndexBtn"),
  navAbout: document.getElementById("navAbout"),
  heroTitle: document.getElementById("heroTitle"),
  langViBtn: document.getElementById("langViBtn"),
  langEnBtn: document.getElementById("langEnBtn"),
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
  if (aboutEls.viewGalleryBtn) {
    aboutEls.viewGalleryBtn.href = `./index.html?view=gallery&lang=${language}`;
  }
  if (aboutEls.viewIndexBtn) {
    aboutEls.viewIndexBtn.href = `./index.html?view=index&lang=${language}`;
  }
  if (aboutEls.navAbout) {
    aboutEls.navAbout.href = `./about.html?lang=${language}`;
  }
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
}

function switchLanguage(language) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  applyLanguage(language);
  const url = new URL(window.location.href);
  url.searchParams.set("lang", language);
  window.history.replaceState(window.history.state, "", url.toString());
}

function initializeAboutPage() {
  const language = getInitialLanguage();
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  applyLanguage(language);
  aboutEls.langViBtn?.addEventListener("click", () => switchLanguage("vi"));
  aboutEls.langEnBtn?.addEventListener("click", () => switchLanguage("en"));
}

initializeAboutPage();
