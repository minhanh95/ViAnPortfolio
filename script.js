const i18n = {
  vi: {
    pageTitle: "VAN.LAB Portfolio",
    brandTagline: "Design and technology portfolio",
    viewGallery: "Gallery",
    viewIndex: "Index",
    navAbout: "About",
    navMeet: "Meet",
    navContact: "Contact",
    portfolioLabel: "Portfolio",
    heroTitle: "Tập trung vào sản phẩm, kể chuyện bằng không gian và hình ảnh.",
    heroSubtext:
      "Art Direction, Set Design và Product Thinking cho các chiến dịch thị giác đòi hỏi cả thẩm mỹ lẫn hệ thống thực thi rõ ràng.",
    thProject: "Project",
    thCategory: "Category",
    thTechnology: "Technology",
    thYear: "Year",
    infoProject: "Project",
    infoTechnology: "Technology",
    infoYear: "Year",
    lastUpdateLabel: "LAST UPDATE: April 2, 2026",
    ctaLabel: "Reach out for full portfolio: ngv.vian@gmail.com",
    aboutStudioLabel: "About",
    aboutStudioBody:
      "VAN.LAB là hồ sơ cá nhân tập trung vào các dự án visual-led, kết hợp tư duy mỹ thuật và triển khai sản phẩm số.",
    servicesLabel: "Services",
    servicesBody: "Art Direction, Set Design, Visual Identity, Interface Design, Spatial Storytelling",
    contactLabel: "Contact",
    phoneLabel: "Phone",
    addressLabel: "Address",
    previewHint: "Hover để xem preview",
  },
  en: {
    pageTitle: "VAN.LAB Portfolio",
    brandTagline: "Design and technology portfolio",
    viewGallery: "Gallery",
    viewIndex: "Index",
    navAbout: "About",
    navMeet: "Meet",
    navContact: "Contact",
    portfolioLabel: "Portfolio",
    heroTitle: "Product-focused direction with spatial visual storytelling.",
    heroSubtext:
      "Art Direction, Set Design, and Product Thinking for visual campaigns that balance aesthetics with execution clarity.",
    thProject: "Project",
    thCategory: "Category",
    thTechnology: "Technology",
    thYear: "Year",
    infoProject: "Project",
    infoTechnology: "Technology",
    infoYear: "Year",
    lastUpdateLabel: "LAST UPDATE: April 2, 2026",
    ctaLabel: "Reach out for full portfolio: ngv.vian@gmail.com",
    aboutStudioLabel: "About",
    aboutStudioBody:
      "VAN.LAB is a personal portfolio focused on visual-led projects, combining art direction craft with product-minded execution.",
    servicesLabel: "Services",
    servicesBody: "Art Direction, Set Design, Visual Identity, Interface Design, Spatial Storytelling",
    contactLabel: "Contact",
    phoneLabel: "Phone",
    addressLabel: "Address",
    previewHint: "Hover to preview",
  },
};

const projects = [
  {
    slug: "no-one-magazine",
    name: "No One Magazine",
    category: { vi: "Media Campaign", en: "Media Campaign" },
    technology: "Art Direction, Set Design",
    year: 2025,
    description: {
      vi: "Hệ visual cho chiến dịch tạp chí với định hướng thời trang đương đại và xử lý bố cục nhân vật theo tinh thần editorial.",
      en: "Visual direction for a contemporary editorial campaign with stylized character composition and magazine-led atmosphere.",
    },
    coverPath: "assets/projects/no-one-magazine/cover.jpg",
  },
  {
    slug: "lofficiel-beauty-award",
    name: "L'Officiel Beauty Award 2025",
    category: { vi: "Media Campaign", en: "Media Campaign" },
    technology: "Art Direction, Set Design",
    year: 2025,
    description: {
      vi: "Dẫn dắt concept và không gian hình ảnh cho chiến dịch giải thưởng làm đẹp, tối ưu cho xuất bản đa nền tảng.",
      en: "Concept and visual space direction for a beauty award campaign optimized for multi-platform publishing.",
    },
    coverPath: "assets/projects/lofficiel-beauty-award-2025/cover.jpg",
  },
  {
    slug: "vinamilk-green-farm",
    name: "Vinamilk Green Farm",
    category: { vi: "Photography", en: "Photography" },
    technology: "Set Design, Production",
    year: 2025,
    description: {
      vi: "Thiết kế bối cảnh chính cho key visual, nhấn vào ngôn ngữ sạch, tươi và nhất quán thương hiệu.",
      en: "Lead set design for key visuals with a clean, fresh language aligned to brand consistency.",
    },
    coverPath: "assets/projects/vinamilk-green-farm/cover.jpg",
  },
  {
    slug: "one-plus",
    name: "One Plus",
    category: { vi: "Media Campaign", en: "Media Campaign" },
    technology: "Art Direction Support",
    year: 2024,
    description: {
      vi: "Hỗ trợ art direction cho chiến dịch thương mại với nhịp điệu thị giác mạnh và hệ thống layout động.",
      en: "Assistant art direction on a commercial campaign with high visual rhythm and dynamic layout system.",
    },
    coverPath: "assets/projects/one-plus/cover.jpg",
  },
  {
    slug: "x3d-robot",
    name: "X3D Robot",
    category: { vi: "3D Animation", en: "3D Animation" },
    technology: "3D Pipeline, Motion",
    year: 2023,
    description: {
      vi: "Sản xuất nội dung 3D animation với pipeline rõ ràng, tập trung vào nhịp chuyển động và độ hoàn thiện hình ảnh.",
      en: "3D animation production with a clear pipeline, focused on motion rhythm and visual finish.",
    },
    coverPath: "assets/projects/x3d-robot/cover.gif",
  },
];

const savedLanguage = localStorage.getItem("vanlab-language");
const defaultLanguage = savedLanguage === "en" ? "en" : "vi";

const state = {
  language: defaultLanguage,
  viewMode: "gallery",
  items: [...projects].sort((a, b) => b.year - a.year),
};

const els = {
  siteHeader: document.getElementById("siteHeader"),
  galleryView: document.getElementById("galleryView"),
  indexView: document.getElementById("indexView"),
  galleryList: document.getElementById("galleryList"),
  tableBody: document.getElementById("projectsTableBody"),
  indexPreview: document.getElementById("indexPreview"),
  langViBtn: document.getElementById("langViBtn"),
  langEnBtn: document.getElementById("langEnBtn"),
  viewGalleryBtn: document.getElementById("viewGalleryBtn"),
  viewIndexBtn: document.getElementById("viewIndexBtn"),
};

function t(key) {
  return i18n[state.language][key];
}

function getLocalizedValue(value) {
  if (value && typeof value === "object") {
    return value[state.language] || value.en || "";
  }
  return value ?? "";
}

function renderStaticText() {
  document.documentElement.lang = state.language;
  document.title = t("pageTitle");

  document.getElementById("brandTagline").textContent = t("brandTagline");
  document.getElementById("viewGalleryBtn").textContent = t("viewGallery");
  document.getElementById("viewIndexBtn").textContent = t("viewIndex");
  document.getElementById("navAbout").textContent = t("navAbout");
  document.getElementById("navMeet").textContent = t("navMeet");
  document.getElementById("navContact").textContent = t("navContact");
  document.getElementById("portfolioLabel").textContent = t("portfolioLabel");
  document.getElementById("heroTitle").textContent = t("heroTitle");
  document.getElementById("heroSubtext").textContent = t("heroSubtext");

  document.getElementById("thProject").textContent = t("thProject");
  document.getElementById("thCategory").textContent = t("thCategory");
  document.getElementById("thTechnology").textContent = t("thTechnology");
  document.getElementById("thYear").textContent = t("thYear");

  document.getElementById("lastUpdateLabel").textContent = t("lastUpdateLabel");
  document.getElementById("ctaLabel").textContent = t("ctaLabel");
  document.getElementById("aboutStudioLabel").textContent = t("aboutStudioLabel");
  document.getElementById("aboutStudioBody").textContent = t("aboutStudioBody");
  document.getElementById("servicesLabel").textContent = t("servicesLabel");
  document.getElementById("servicesBody").textContent = t("servicesBody");
  document.getElementById("contactLabel").textContent = t("contactLabel");
  document.getElementById("phoneLabel").textContent = t("phoneLabel");
  document.getElementById("addressLabel").textContent = t("addressLabel");

  els.langViBtn.classList.toggle("active", state.language === "vi");
  els.langEnBtn.classList.toggle("active", state.language === "en");
  els.viewGalleryBtn.classList.toggle("active", state.viewMode === "gallery");
  els.viewIndexBtn.classList.toggle("active", state.viewMode === "index");
}

function renderGallery() {
  els.galleryList.innerHTML = "";
  state.items.forEach((project) => {
    const item = document.createElement("article");
    item.className = "gallery-item";
    item.innerHTML = `
      <div class="gallery-media">
        <img src="${project.coverPath}" alt="${project.name} cover" loading="lazy" />
      </div>
      <div class="gallery-info">
        <div>
          <p class="meta-label">${t("infoProject")}</p>
          <p>${project.name} | ${getLocalizedValue(project.category)}</p>
        </div>
        <div>
          <p class="meta-label">${t("infoTechnology")}</p>
          <p>${project.technology}</p>
        </div>
        <div>
          <p class="meta-label">${t("infoYear")}</p>
          <p>${project.year}</p>
        </div>
      </div>
      <p class="gallery-description">${getLocalizedValue(project.description)}</p>
    `;
    els.galleryList.appendChild(item);
  });
}

function renderIndexTable() {
  els.tableBody.innerHTML = "";
  state.items.forEach((project) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${project.name}</td>
      <td>${getLocalizedValue(project.category)}</td>
      <td>${project.technology}</td>
      <td>${project.year}</td>
    `;
    row.addEventListener("mouseenter", () => renderIndexPreview(project));
    row.addEventListener("focus", () => renderIndexPreview(project));
    row.addEventListener("click", () => renderIndexPreview(project));
    els.tableBody.appendChild(row);
  });

  renderIndexPreview(state.items[0]);
}

function renderIndexPreview(project) {
  if (!project) {
    els.indexPreview.innerHTML = `<p>${t("previewHint")}</p>`;
    return;
  }
  els.indexPreview.innerHTML = `
    <img src="${project.coverPath}" alt="${project.name} preview" />
    <div class="index-preview-meta">
      <p>${project.name}</p>
      <p>${project.year} - ${getLocalizedValue(project.category)}</p>
    </div>
  `;
}

function applyViewMode() {
  const isGallery = state.viewMode === "gallery";
  els.galleryView.classList.toggle("hidden", !isGallery);
  els.indexView.classList.toggle("hidden", isGallery);
}

function switchLanguage(language) {
  state.language = language;
  localStorage.setItem("vanlab-language", language);
  renderStaticText();
  renderGallery();
  renderIndexTable();
}

function switchViewMode(mode) {
  state.viewMode = mode;
  renderStaticText();
  applyViewMode();
}

function initScrollReveal() {
  const nodes = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  nodes.forEach((node) => observer.observe(node));
}

function wireHeaderGlassEffect() {
  const onScroll = () => {
    els.siteHeader.classList.toggle("scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll);
  onScroll();
}

els.langViBtn.addEventListener("click", () => switchLanguage("vi"));
els.langEnBtn.addEventListener("click", () => switchLanguage("en"));
els.viewGalleryBtn.addEventListener("click", () => switchViewMode("gallery"));
els.viewIndexBtn.addEventListener("click", () => switchViewMode("index"));

renderStaticText();
renderGallery();
renderIndexTable();
applyViewMode();
wireHeaderGlassEffect();
initScrollReveal();
