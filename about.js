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
    skillsSectionLabel: "Kỹ năng",
    toolsHeading: "Công cụ",
    digitalHeading: "Kỹ năng số",
    analogHeading: "Kỹ năng thủ công",
    langHeading: "Ngôn ngữ",
    clientsSectionLabel: "Khách hàng",
    servicesSectionLabel: "Dịch vụ",
    industrySectionLabel: "Ngành",
    softwareItems: [
      "Adobe Illustrator",
      "Adobe Photoshop",
      "Adobe InDesign",
      "Figma",
      "Blender",
      "Procreate",
      "Slack",
      "Microsoft Office",
    ],
    digitalSkillsItems: [
      "Concept Development",
      "Visual Development & Design",
      "Spatial & Set design",
      "Interface Design",
      "Layout Design",
      "Animation & 2D production",
    ],
    analogSkillsItems: ["Model making", "Set design", "Food styling", "Bookbinding"],
    languagesItems: ["Tiếng Việt: bản ngữ", "Tiếng Anh: thành thạo"],
    clientsListItems: [
      "Vinamilk",
      "Highland",
      "Pizza Hut",
      "KFC",
      "Cheese Coffee",
      "An Miên",
      "Táo Tào",
      "Vesou",
      "Ép Phê",
      "OnePlus",
      "PS",
      "Hazeline",
      "Color Key",
      "Nimai",
      "G.G.G",
      "Downy",
      "No-one Magazine",
      "L'Officiel",
      "Life Center Vietnam",
      "Elink English",
      "Invisible Space Studio",
      "X3D Studio",
      "Refinery Media",
    ],
    servicesItems: [
      "Campaign Collateral",
      "Art Direction",
      "UI Direction",
      "Set Design",
      "Production Design",
      "Food Styling",
    ],
    industryItems: [
      "Thực phẩm & Đồ uống",
      "Làm đẹp",
      "Chăm sóc gia đình",
      "Điện ảnh",
      "Công nghệ",
      "Nghệ thuật & Văn hóa",
      "Thời trang",
    ],
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
    skillsSectionLabel: "Skills",
    toolsHeading: "Tools",
    digitalHeading: "Digital Skill",
    analogHeading: "Analog Skill",
    langHeading: "Language",
    clientsSectionLabel: "Clients",
    servicesSectionLabel: "Service",
    industrySectionLabel: "INDUSTRY",
    softwareItems: [
      "Adobe Illustrator",
      "Adobe Photoshop",
      "Adobe InDesign",
      "Figma",
      "Blender",
      "Procreate",
      "Slack",
      "Microsoft Office",
    ],
    digitalSkillsItems: [
      "Concept Development",
      "Visual Development & Design",
      "Spatial & Set design",
      "Interface Design",
      "Layout Design",
      "Animation & 2D production",
    ],
    analogSkillsItems: ["Model making", "Set design", "Food styling", "Bookbinding"],
    languagesItems: ["Vietnamese: native", "English: fluent"],
    clientsListItems: [
      "Vinamilk",
      "Highland",
      "Pizza Hut",
      "KFC",
      "Cheese Coffee",
      "An Miên",
      "Táo Tào",
      "Vesou",
      "Ép Phê",
      "OnePlus",
      "PS",
      "Hazeline",
      "Color Key",
      "Nimai",
      "G.G.G",
      "Downy",
      "No-one Magazine",
      "L'Officiel",
      "Life Center Vietnam",
      "Elink English",
      "Invisible Space Studio",
      "X3D Studio",
      "Refinery Media",
    ],
    servicesItems: [
      "Campaign Collateral",
      "Art Direction",
      "UI Direction",
      "Set Design",
      "Production Design",
      "Food Styling",
    ],
    industryItems: [
      "Food & Beverage",
      "Beauty",
      "Home care",
      "Film",
      "Technology",
      "Art & Culture",
      "Fashion",
    ],
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

function renderListItems(target, items) {
  if (!target || !Array.isArray(items)) return;
  target.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
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

function syncAboutPrefsToUrl(language) {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    if (window.VANLAB_THEME) {
      url.searchParams.set("theme", window.VANLAB_THEME.get());
    }
    window.history.replaceState(window.history.state, "", url.toString());
  } catch (e) {
    /* ignore */
  }
}

function updateThemeToggleUi(language) {
  if (!aboutEls.themeToggleBtn || !window.VANLAB_THEME) return;
  const dict = aboutI18n[language] || aboutI18n.en;
  aboutEls.themeToggleBtn.textContent = "";
  aboutEls.themeToggleBtn.title = dict.themeToggleLabel;
  aboutEls.themeToggleBtn.setAttribute("aria-label", dict.themeToggleLabel);
}

function applyAboutBody(dict) {
  setText(document.getElementById("aboutSkillsSectionLabel"), dict.skillsSectionLabel);
  setText(document.getElementById("aboutToolsHeading"), dict.toolsHeading);
  setText(document.getElementById("aboutDigitalHeading"), dict.digitalHeading);
  setText(document.getElementById("aboutAnalogHeading"), dict.analogHeading);
  setText(document.getElementById("aboutLangHeading"), dict.langHeading);
  setText(document.getElementById("aboutServicesSectionLabel"), dict.servicesSectionLabel);
  setText(document.getElementById("aboutIndustrySectionLabel"), dict.industrySectionLabel);
  setText(document.getElementById("aboutClientsSectionLabel"), dict.clientsSectionLabel);

  renderListItems(document.getElementById("aboutToolsList"), dict.softwareItems);
  renderListItems(document.getElementById("aboutDigitalList"), dict.digitalSkillsItems);
  renderListItems(document.getElementById("aboutAnalogList"), dict.analogSkillsItems);
  renderListItems(document.getElementById("aboutLangList"), dict.languagesItems);
  renderListItems(document.getElementById("aboutServicesList"), dict.servicesItems);
  renderListItems(document.getElementById("aboutIndustryList"), dict.industryItems);
  renderListItems(document.getElementById("aboutStudioBody"), dict.clientsListItems);
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
  applyAboutBody(dict);
  window.VANLAB_REFRESH_FOOTER_BAR?.();
  updateHeaderLinks(language);
  updateThemeToggleUi(language);
}

function initializeAboutPage() {
  let currentLanguage = getInitialLanguage();

  function switchLanguage(language) {
    currentLanguage = language;
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (e) {
      /* ignore private mode / blocked storage */
    }
    applyLanguage(language);
    syncAboutPrefsToUrl(language);
  }

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  } catch (e) {
    /* ignore */
  }
  applyLanguage(currentLanguage);
  syncAboutPrefsToUrl(currentLanguage);

  aboutEls.langViBtn?.addEventListener("click", () => switchLanguage("vi"));
  aboutEls.langEnBtn?.addEventListener("click", () => switchLanguage("en"));
  aboutEls.themeToggleBtn?.addEventListener("click", () => {
    if (!window.VANLAB_THEME) return;
    window.VANLAB_THEME.toggle({ syncUrl: true });
  });
  window.addEventListener("vanlab-themechange", () => {
    applyLanguage(currentLanguage);
    syncAboutPrefsToUrl(currentLanguage);
  });
}

initializeAboutPage();
