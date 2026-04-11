const i18n = {
  vi: {
    pageTitle: "VAN.LAB Portfolio",
    brandTagline: "Artist Portfolio - Art Direction, Product Thinking, Spatial Storytelling",
    viewGallery: "Gallery",
    viewIndex: "Index",
    navAbout: "About",
    navMeet: "Skills",
    navContact: "Contact",
    portfolioLabel: "Portfolio",
    heroTitle: "Vian Nguyen is an Art Director",
    heroSubtext:
      "With a background in spatial studies and illustration, Vian moved into product thinking and spatial storytelling - translating ideas into tangible experiences beyond visuals. The practice grew from art direction through constant experimentation across mediums, shaping both creative thinking and execution. With experience spanning agile teams to large-scale productions, I now lead projects for major brands in Vietnam as Team Lead and Art Director at Invisible Space Studio.",
    thYear: "Year",
    thClient: "Client",
    thType: "Type",
    infoProject: "Project",
    infoTechnology: "Statement of Work",
    infoYear: "Year",
    caseBack: "Quay lại danh sách",
    caseInfoMore: "Xem chi tiết",
    caseInfoLess: "Ẩn chi tiết",
    slidePrev: "Ảnh trước",
    slideNext: "Ảnh sau",
    caseInfoTechLabel: "Statement of Work:",
    caseInfoYearLabel: "Year:",
    nextProject: "Dự án tiếp theo",
    skillsLabel: "Kỹ năng",
    softwareLabel: "Software",
    softwareItems: ["Adobe Suite", "Figma", "Canva", "AI tools: Midjourney & Gemini"],
    digitalSkillsLabel: "Digital Skill",
    digitalSkillsItems: [
      "Visual Design",
      "Concept Development",
      "Photo Editing",
      "Interface Design",
      "Layout Design",
    ],
    analogSkillsLabel: "Analog Skill",
    analogSkillsItems: ["Bookbinding", "Model Making", "Set Design"],
    languagesLabel: "Language",
    languagesItems: ["Vietnamese: native", "English: fluent"],
    aboutStudioLabel: "Clients",
    aboutStudioBody:
      "Vinamilk\nHighland\nPizza Hut\nKFC\nCheese Coffee\nAn Miên\nTáo Tào\nVesou\nÉp Phê\nOnePlus\nPS\nHazeline\nColor Key\nNimai\nG.G.G\nDowny\nNo-one Magazine\nL'Officiel\nLife Center Vietnam\nElink English\nInvisible Space Studio\nX3D Studio\nRefinery Media",
    servicesLabel: "Statement of Work",
    servicesBody: "Art Direction, Set Design, Visual Identity, Editorial Visual System, Spatial Storytelling.",
    contactLabel: "Liên hệ",
    phoneLabel: "Điện thoại",
    addressLabel: "Địa chỉ",
    linkedinLabel: "LinkedIn",
    linkedinValue: "Sẽ cập nhật",
    previewHint: "Hover để xem preview",
  },
  en: {
    pageTitle: "VAN.LAB Portfolio",
    brandTagline: "Artist Portfolio - Art Direction, Product Thinking, Spatial Storytelling",
    viewGallery: "Gallery",
    viewIndex: "Index",
    navAbout: "About",
    navMeet: "Skills",
    navContact: "Contact",
    portfolioLabel: "Portfolio",
    heroTitle: "Vian Nguyen is an Art Director",
    heroSubtext:
      "With a background in spatial studies and illustration, Vian moved into product thinking and spatial storytelling - translating ideas into tangible experiences beyond visuals. The practice grew from art direction through constant experimentation across mediums, shaping both creative thinking and execution. With experience spanning agile teams to large-scale productions, I now lead projects for major brands in Vietnam as Team Lead and Art Director at Invisible Space Studio.",
    thYear: "Year",
    thClient: "Client",
    thType: "Type",
    infoProject: "Project",
    infoTechnology: "Statement of Work",
    infoYear: "Year",
    caseBack: "Back to list",
    caseInfoMore: "Show details",
    caseInfoLess: "Hide details",
    slidePrev: "Previous image",
    slideNext: "Next image",
    caseInfoTechLabel: "Statement of Work:",
    caseInfoYearLabel: "Year:",
    nextProject: "Next Project",
    skillsLabel: "Skills",
    softwareLabel: "Software",
    softwareItems: ["Adobe Suite", "Figma", "Canva", "AI tools: Midjourney & Gemini"],
    digitalSkillsLabel: "Digital Skill",
    digitalSkillsItems: [
      "Visual Design",
      "Concept Development",
      "Photo Editing",
      "Interface Design",
      "Layout Design",
    ],
    analogSkillsLabel: "Analog Skill",
    analogSkillsItems: ["Bookbinding", "Model Making", "Set Design"],
    languagesLabel: "Language",
    languagesItems: ["Vietnamese: native", "English: fluent"],
    aboutStudioLabel: "Clients",
    aboutStudioBody:
      "Vinamilk\nHighland\nPizza Hut\nKFC\nCheese Coffee\nAn Miên\nTáo Tào\nVesou\nÉp Phê\nOnePlus\nPS\nHazeline\nColor Key\nNimai\nG.G.G\nDowny\nNo-one Magazine\nL'Officiel\nLife Center Vietnam\nElink English\nInvisible Space Studio\nX3D Studio\nRefinery Media",
    servicesLabel: "Services",
    servicesBody: "Art Direction, Set Design, Visual Identity, Editorial Visual System, Spatial Storytelling.",
    contactLabel: "Contact",
    phoneLabel: "Phone",
    addressLabel: "Address",
    linkedinLabel: "LinkedIn",
    linkedinValue: "To be updated",
    previewHint: "Hover to preview",
  },
};

const projects = [
  {
    slug: "no-one-magazine",
    name: "No One Magazine",
    client: "No-one Magazine",
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
    client: "L'Officiel",
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
    client: "Vinamilk",
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
    client: "OnePlus",
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
    client: "X3D Studio",
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

const sortedProjects = [...projects].sort((a, b) => b.year - a.year);
const defaultLanguage = "en";

const state = {
  language: defaultLanguage,
  viewMode: "gallery",
  inCaseStudy: false,
  mobileInfoCollapsed: true,
  items: sortedProjects,
  selectedSlug: sortedProjects[0]?.slug || "",
  caseSlideIndex: 0,
  caseAnimating: false,
};

let topCardSwipeCleanup = null;
let lenisInstance = null;
const detailResolvePromises = new Map();
const imageWarmupCache = new Set();

const els = {
  siteHeader: document.getElementById("siteHeader"),
  about: document.getElementById("about"),
  meet: document.getElementById("meet"),
  contact: document.getElementById("contact"),
  galleryView: document.getElementById("galleryView"),
  indexView: document.getElementById("indexView"),
  caseStudyView: document.getElementById("caseStudyView"),
  galleryList: document.getElementById("galleryList"),
  tableBody: document.getElementById("projectsTableBody"),
  indexPreview: document.getElementById("indexPreview"),
  caseBackBtn: document.getElementById("caseBackBtn"),
  caseInfoToggleBtn: document.getElementById("caseInfoToggleBtn"),
  caseInfoBody: document.getElementById("caseInfoBody"),
  caseTitle: document.getElementById("caseTitle"),
  caseType: document.getElementById("caseType"),
  caseTech: document.getElementById("caseTech"),
  caseYear: document.getElementById("caseYear"),
  caseDescription: document.getElementById("caseDescription"),
  caseSlideTrack: document.getElementById("caseSlideTrack"),
  caseSlidePrevBtn: document.getElementById("caseSlidePrevBtn"),
  caseSlideNextBtn: document.getElementById("caseSlideNextBtn"),
  caseInfoTechLabel: document.getElementById("caseInfoTechLabel"),
  caseInfoYearLabel: document.getElementById("caseInfoYearLabel"),
  caseInfoTech: document.getElementById("caseInfoTech"),
  caseInfoYear: document.getElementById("caseInfoYear"),
  nextProjectBtn: document.getElementById("nextProjectBtn"),
  langViBtn: document.getElementById("langViBtn"),
  langEnBtn: document.getElementById("langEnBtn"),
  viewGalleryBtn: document.getElementById("viewGalleryBtn"),
  viewIndexBtn: document.getElementById("viewIndexBtn"),
};

function t(key) {
  return i18n[state.language][key];
}

function getLocalizedValue(value) {
  if (value && typeof value === "object") return value[state.language] || value.en || "";
  return value ?? "";
}

function getSelectedProject() {
  return state.items.find((item) => item.slug === state.selectedSlug) || state.items[0];
}

function normalizeSlideImages(project) {
  const rawImages = project.detailImages?.length ? project.detailImages : [project.coverPath];
  const uniqueImages = [...new Set(rawImages)];
  const withoutCover = uniqueImages.filter((path) => path !== project.coverPath);
  return [project.coverPath, ...withoutCover];
}

function isMobileCaseLayout() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function setSelectedProject(slug) {
  state.selectedSlug = slug;
  state.caseSlideIndex = 0;
}

function applyMobileInfoState() {
  const collapsed = isMobileCaseLayout() ? state.mobileInfoCollapsed : false;
  els.caseStudyView.classList.toggle("mobile-info-collapsed", collapsed);
  if (els.caseInfoToggleBtn) {
    els.caseInfoToggleBtn.textContent = collapsed ? t("caseInfoMore") : t("caseInfoLess");
  }
}

function getFolderPath(path) {
  return path.slice(0, path.lastIndexOf("/"));
}

function checkImageExists(path) {
  return new Promise((resolve) => {
    const image = new Image();
    const timeout = setTimeout(() => resolve(false), 800);
    image.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    image.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };
    image.src = path;
  });
}

function warmupImages(paths) {
  paths.forEach((path) => {
    if (!path || imageWarmupCache.has(path)) return;
    imageWarmupCache.add(path);
    const image = new Image();
    image.decoding = "async";
    image.loading = "eager";
    image.src = path;
  });
}

async function resolveDetailImagesForProject(project) {
  const detailImages = [project.coverPath];
  const folder = getFolderPath(project.coverPath);
  const maxDetailImages = 20;
  let foundAny = false;

  for (let index = 1; index <= maxDetailImages; index += 1) {
    const fileIndex = String(index).padStart(2, "0");
    const detailPath = `${folder}/detail-${fileIndex}.jpg`;
    const exists = await checkImageExists(detailPath);
    if (exists) {
      detailImages.push(detailPath);
      foundAny = true;
      continue;
    }
    if (foundAny || index === 1) {
      break;
    }
  }

  return detailImages;
}

async function ensureProjectDetailImages(project) {
  if (project.detailImages?.length) {
    return project.detailImages;
  }
  if (detailResolvePromises.has(project.slug)) {
    return detailResolvePromises.get(project.slug);
  }

  const promise = resolveDetailImagesForProject(project).then((images) => {
    project.detailImages = images;
    detailResolvePromises.delete(project.slug);
    return images;
  });

  detailResolvePromises.set(project.slug, promise);
  return promise;
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
  document.getElementById("thYear").textContent = t("thYear");
  document.getElementById("thClient").textContent = t("thClient");
  document.getElementById("thType").textContent = t("thType");
  document.getElementById("skillsLabel").textContent = t("skillsLabel");
  document.getElementById("softwareLabel").textContent = t("softwareLabel");
  document.getElementById("digitalSkillsLabel").textContent = t("digitalSkillsLabel");
  document.getElementById("analogSkillsLabel").textContent = t("analogSkillsLabel");
  document.getElementById("languagesLabel").textContent = t("languagesLabel");
  renderListItems(document.getElementById("softwareList"), t("softwareItems"));
  renderListItems(document.getElementById("digitalSkillsList"), t("digitalSkillsItems"));
  renderListItems(document.getElementById("analogSkillsList"), t("analogSkillsItems"));
  renderListItems(document.getElementById("languagesList"), t("languagesItems"));
  document.getElementById("aboutStudioLabel").textContent = t("aboutStudioLabel");
  document.getElementById("aboutStudioBody").textContent = t("aboutStudioBody");
  document.getElementById("servicesLabel").textContent = t("servicesLabel");
  document.getElementById("servicesBody").textContent = t("servicesBody");
  document.getElementById("contactLabel").textContent = t("contactLabel");
  document.getElementById("phoneLabel").textContent = t("phoneLabel");
  document.getElementById("addressLabel").textContent = t("addressLabel");
  document.getElementById("linkedinLabel").textContent = t("linkedinLabel");
  document.getElementById("linkedinValue").textContent = t("linkedinValue");
  els.caseBackBtn.textContent = t("caseBack");
  applyMobileInfoState();
  els.caseSlidePrevBtn.setAttribute("aria-label", t("slidePrev"));
  els.caseSlideNextBtn.setAttribute("aria-label", t("slideNext"));
  els.caseInfoTechLabel.textContent = t("caseInfoTechLabel");
  els.caseInfoYearLabel.textContent = t("caseInfoYearLabel");
  els.nextProjectBtn.textContent = t("nextProject");

  els.langViBtn.classList.toggle("active", state.language === "vi");
  els.langEnBtn.classList.toggle("active", state.language === "en");
  els.viewGalleryBtn.classList.toggle("active", state.viewMode === "gallery");
  els.viewIndexBtn.classList.toggle("active", state.viewMode === "index");
}

function renderListItems(target, items) {
  if (!target || !Array.isArray(items)) return;
  target.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function attachGalleryMediaParallax(media) {
  if (!media || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const img = media.querySelector("img");
  if (!img) return;

  const onMove = (event) => {
    const rect = media.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    const max = 11;
    img.style.setProperty("--img-px", `${-nx * max * 2}px`);
    img.style.setProperty("--img-py", `${-ny * max * 2}px`);
  };

  const onLeave = () => {
    img.style.setProperty("--img-px", "0px");
    img.style.setProperty("--img-py", "0px");
  };

  media.addEventListener("pointermove", onMove);
  media.addEventListener("pointerleave", onLeave);
}

function renderGallery() {
  els.galleryList.innerHTML = "";
  state.items.forEach((project) => {
    const item = document.createElement("article");
    item.className = "gallery-item";
    item.innerHTML = `
      <div class="gallery-media">
        <img src="${project.coverPath}" alt="${project.name} cover" loading="lazy" decoding="async" />
      </div>
      <div class="gallery-info">
        <div><p class="meta-label">${t("infoProject")}</p><p class="gallery-lead-line"><span class="heading-display">${project.name}</span><span class="gallery-title-sep"> | </span>${getLocalizedValue(
      project.category,
    )}</p></div>
        <div><p class="meta-label">${t("infoTechnology")}</p><p>${project.technology}</p></div>
        <div><p class="meta-label">${t("infoYear")}</p><p>${project.year}</p></div>
      </div>
      <p class="gallery-description">${getLocalizedValue(project.description)}</p>
    `;
    item.addEventListener("click", () => openCaseStudy(project.slug));
    els.galleryList.appendChild(item);
    attachGalleryMediaParallax(item.querySelector(".gallery-media"));
  });
}

function renderIndexTable() {
  els.tableBody.innerHTML = "";
  state.items.forEach((project) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${project.year}</td>
      <td>${project.client}</td>
      <td>${getLocalizedValue(project.category)}</td>
    `;
    row.addEventListener("mouseenter", () => renderIndexPreview(project));
    row.addEventListener("click", () => openCaseStudy(project.slug));
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
      <p>${project.year} - ${project.client} - ${getLocalizedValue(project.category)}</p>
    </div>
  `;
}

function renderCaseStudy() {
  const project = getSelectedProject();
  if (!project) return;

  const slideImages = normalizeSlideImages(project);
  warmupImages(slideImages);

  els.caseTitle.textContent = project.name;
  els.caseType.textContent = getLocalizedValue(project.category);
  els.caseTech.textContent = project.technology;
  els.caseYear.textContent = String(project.year);
  els.caseDescription.textContent = getLocalizedValue(project.description);
  els.caseInfoTech.textContent = project.technology;
  els.caseInfoYear.textContent = String(project.year);

  if (state.caseSlideIndex >= slideImages.length) {
    state.caseSlideIndex = 0;
  }

  els.caseSlideTrack.innerHTML = slideImages
    .map(
      (path, imageIndex) => `
        <figure class="case-image-item">
          <img src="${path}" alt="${project.name} detail ${imageIndex + 1}" loading="lazy" />
        </figure>`,
    )
    .join("");

  updateCaseSlideArrowsState(slideImages.length);
}

function getStackCardVisual(offset, stepX) {
  const distance = Math.abs(offset);
  if (distance > 2) {
    return {
      x: offset * stepX,
      scale: 0.5,
      opacity: 0,
      blur: 6,
      rotateY: offset > 0 ? -1.2 : 1.2,
      z: 1,
    };
  }

  if (distance === 0) {
    return {
      x: 0,
      scale: 1,
      opacity: 1,
      blur: 0,
      rotateY: 0,
      z: 30,
    };
  }

  if (distance === 1) {
    return {
      x: offset * stepX,
      scale: 0.8,
      opacity: 0.6,
      blur: 5,
      rotateY: offset > 0 ? -1.2 : 1.2,
      z: 9,
    };
  }

  return {
    x: offset * stepX,
    scale: 0.6,
    opacity: 0.6,
    blur: 5,
    rotateY: offset > 0 ? -1.2 : 1.2,
    z: 8,
  };
}

function getCircularOffset(index, active, total) {
  let diff = index - active;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

function positionCaseCards(totalImages, animate = true) {
  const cards = Array.from(els.caseSlideTrack.querySelectorAll(".case-stack-card"));
  if (!cards.length) return;

  const trackWidth = els.caseSlideTrack.clientWidth || 700;
  const stepX = Math.max(96, Math.min(132, trackWidth * 0.16));

  if (!animate) {
    els.caseSlideTrack.classList.add("no-motion");
  } else {
    els.caseSlideTrack.classList.remove("no-motion");
  }

  const activeCard = cards.find((card) => Number(card.dataset.imageIndex || 0) === state.caseSlideIndex) || null;

  cards.forEach((card) => {
    const imageIndex = Number(card.dataset.imageIndex || 0);
    const offset = getCircularOffset(imageIndex, state.caseSlideIndex, totalImages);
    const isActive = activeCard === card;
    const visual = isActive
      ? {
          x: 0,
          scale: 1,
          opacity: 1,
          blur: 0,
          rotateY: 0,
          z: 30,
        }
      : getStackCardVisual(offset, stepX);

    card.dataset.offset = String(offset);
    card.classList.toggle("is-top", isActive);
    card.style.zIndex = String(visual.z);
    card.style.setProperty("--card-x", `${visual.x}px`);
    card.style.setProperty("--card-scale", String(visual.scale));
    card.style.setProperty("--card-opacity", String(visual.opacity));
    card.style.setProperty("--card-blur", `${visual.blur}px`);
    card.style.setProperty("--card-ry", `${visual.rotateY}deg`);
    card.style.setProperty("--drag-x", "0px");
    card.style.setProperty("--drag-rot", "0deg");
    if (offset !== 0) {
      card.style.opacity = "";
      card.classList.remove("dragging");
    }
  });

  if (!animate) {
    requestAnimationFrame(() => {
      els.caseSlideTrack.classList.remove("no-motion");
    });
  }
}

function animateCardShift(direction, totalImages) {
  if (state.caseAnimating) return;
  state.caseAnimating = true;
  const delta = direction > 0 ? -1 : 1;
  state.caseSlideIndex = (state.caseSlideIndex + delta + totalImages) % totalImages;
  positionCaseCards(totalImages, true);
  resetCaseTopImageParallax();
  window.setTimeout(() => {
    state.caseAnimating = false;
    setupTopCardSwipe(totalImages);
  }, 520);
}

function getCaseSlideCount() {
  const project = getSelectedProject();
  if (!project) return 0;
  return normalizeSlideImages(project).length;
}

function goToPrevCaseSlide() {
  const n = getCaseSlideCount();
  if (n <= 1) return;
  animateCardShift(1, n);
}

function goToNextCaseSlide() {
  const n = getCaseSlideCount();
  if (n <= 1) return;
  animateCardShift(-1, n);
}

function updateCaseSlideArrowsState(slideCount) {
  const disabled = slideCount <= 1;
  els.caseSlidePrevBtn.disabled = disabled;
  els.caseSlideNextBtn.disabled = disabled;
}

function applyViewMode() {
  if (state.inCaseStudy) return;
  const isGallery = state.viewMode === "gallery";
  els.galleryView.classList.toggle("hidden", !isGallery);
  els.indexView.classList.toggle("hidden", isGallery);
}

function applyCaseStudyMode() {
  els.caseStudyView.classList.toggle("hidden", !state.inCaseStudy);
  els.about.classList.toggle("hidden", state.inCaseStudy);
  els.meet.classList.toggle("hidden", state.inCaseStudy);
  els.contact.classList.toggle("hidden", state.inCaseStudy);
  if (state.inCaseStudy) {
    els.galleryView.classList.add("hidden");
    els.indexView.classList.add("hidden");
    applyMobileInfoState();
  } else {
    applyViewMode();
  }
}

async function openCaseStudy(slug) {
  setSelectedProject(slug);
  state.inCaseStudy = true;
  state.mobileInfoCollapsed = isMobileCaseLayout();
  applyCaseStudyMode();
  scrollToPageTop();
  const project = getSelectedProject();
  await ensureProjectDetailImages(project);
  if (!state.inCaseStudy || state.selectedSlug !== slug) {
    return;
  }
  renderCaseStudy();
}

function closeCaseStudy() {
  state.inCaseStudy = false;
  state.mobileInfoCollapsed = true;
  applyCaseStudyMode();
}

async function goToNextProject() {
  const currentIndex = state.items.findIndex((item) => item.slug === state.selectedSlug);
  const nextIndex = (currentIndex + 1) % state.items.length;
  const nextSlug = state.items[nextIndex].slug;
  setSelectedProject(nextSlug);
  await ensureProjectDetailImages(getSelectedProject());
  if (!state.inCaseStudy || state.selectedSlug !== nextSlug) {
    return;
  }
  renderCaseStudy();
}

function setupTopCardSwipe(totalImages) {
  if (typeof topCardSwipeCleanup === "function") {
    topCardSwipeCleanup();
    topCardSwipeCleanup = null;
  }

  const topCard = els.caseSlideTrack.querySelector(".case-stack-card.is-top");
  if (!topCard || totalImages <= 1) return;

  let dragging = false;
  let pointerId = null;
  let startX = 0;
  let currentX = 0;
  let touchDragging = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchCurrentX = 0;
  let touchLockAxis = null;

  const onPointerMove = (event) => {
    if (!dragging || pointerId !== event.pointerId || state.caseAnimating) return;
    currentX = event.clientX - startX;
    const rotation = currentX * 0.04;
    const opacity = Math.max(0.6, 1 - Math.abs(currentX) / 320);
    topCard.style.setProperty("--drag-x", `${currentX}px`);
    topCard.style.setProperty("--drag-rot", `${rotation}deg`);
    topCard.style.opacity = String(opacity);
  };

  const endSwipe = () => {
    if (pointerId !== null && topCard.hasPointerCapture(pointerId)) {
      topCard.releasePointerCapture(pointerId);
    }
    dragging = false;
    pointerId = null;
    topCard.classList.remove("dragging");
  };

  const onPointerUp = (event) => {
    if (!dragging || pointerId !== event.pointerId) return;
    const threshold = Math.max(62, topCard.clientWidth * 0.16);
    const movedX = currentX;
    endSwipe();
    if (!state.caseAnimating && Math.abs(movedX) > threshold) {
      const direction = movedX > 0 ? 1 : -1;
      animateCardShift(direction, totalImages);
      return;
    }
    topCard.style.setProperty("--drag-x", "0px");
    topCard.style.setProperty("--drag-rot", "0deg");
    topCard.style.opacity = "1";
  };

  const onPointerCancel = (event) => {
    if (!dragging || pointerId !== event.pointerId) return;
    endSwipe();
    topCard.style.setProperty("--drag-x", "0px");
    topCard.style.setProperty("--drag-rot", "0deg");
    topCard.style.opacity = "1";
  };

  const onPointerDown = (event) => {
    if (state.caseAnimating) return;
    event.preventDefault();
    dragging = true;
    pointerId = event.pointerId;
    startX = event.clientX;
    currentX = 0;
    topCard.setPointerCapture(pointerId);
    topCard.classList.add("dragging");
    const topImg = topCard.querySelector("img");
    if (topImg) {
      topImg.style.setProperty("--img-parallax-x", "0px");
      topImg.style.setProperty("--img-parallax-y", "0px");
    }
  };

  const applyDragVisual = (deltaX) => {
    const rotation = deltaX * 0.04;
    const opacity = Math.max(0.6, 1 - Math.abs(deltaX) / 320);
    topCard.style.setProperty("--drag-x", `${deltaX}px`);
    topCard.style.setProperty("--drag-rot", `${rotation}deg`);
    topCard.style.opacity = String(opacity);
  };

  const resetDragVisual = () => {
    topCard.style.setProperty("--drag-x", "0px");
    topCard.style.setProperty("--drag-rot", "0deg");
    topCard.style.opacity = "1";
  };

  const onTouchStart = (event) => {
    if (state.caseAnimating || event.touches.length !== 1) return;
    const touch = event.touches[0];
    touchDragging = true;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchCurrentX = 0;
    touchLockAxis = null;
    topCard.classList.add("dragging");
    const topImg = topCard.querySelector("img");
    if (topImg) {
      topImg.style.setProperty("--img-parallax-x", "0px");
      topImg.style.setProperty("--img-parallax-y", "0px");
    }
  };

  const onTouchMove = (event) => {
    if (!touchDragging || state.caseAnimating || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (!touchLockAxis) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        touchLockAxis = Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y";
      } else {
        return;
      }
    }

    if (touchLockAxis === "y") return;
    event.preventDefault();
    touchCurrentX = deltaX;
    applyDragVisual(touchCurrentX);
  };

  const endTouchSwipe = () => {
    touchDragging = false;
    touchLockAxis = null;
    topCard.classList.remove("dragging");
  };

  const onTouchEnd = () => {
    if (!touchDragging) return;
    const threshold = Math.max(62, topCard.clientWidth * 0.16);
    const movedX = touchCurrentX;
    endTouchSwipe();
    if (!state.caseAnimating && Math.abs(movedX) > threshold) {
      const direction = movedX > 0 ? 1 : -1;
      animateCardShift(direction, totalImages);
      return;
    }
    resetDragVisual();
  };

  const onTouchCancel = () => {
    if (!touchDragging) return;
    endTouchSwipe();
    resetDragVisual();
  };

  topCard.addEventListener("pointerdown", onPointerDown);
  topCard.addEventListener("touchstart", onTouchStart, { passive: true });
  topCard.addEventListener("touchmove", onTouchMove, { passive: false });
  topCard.addEventListener("touchend", onTouchEnd, { passive: true });
  topCard.addEventListener("touchcancel", onTouchCancel, { passive: true });
  topCard.style.touchAction = "pan-y";
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerCancel);

  topCardSwipeCleanup = () => {
    topCard.removeEventListener("pointerdown", onPointerDown);
    topCard.removeEventListener("touchstart", onTouchStart);
    topCard.removeEventListener("touchmove", onTouchMove);
    topCard.removeEventListener("touchend", onTouchEnd);
    topCard.removeEventListener("touchcancel", onTouchCancel);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerCancel);
    topCard.style.touchAction = "";
  };
}

function switchLanguage(language) {
  state.language = language;
  localStorage.setItem("vanlab-language", language);
  renderStaticText();
  renderGallery();
  renderIndexTable();
  if (state.inCaseStudy) renderCaseStudy();
}

function switchViewMode(mode) {
  state.viewMode = mode;
  state.inCaseStudy = false;
  state.mobileInfoCollapsed = true;
  renderStaticText();
  applyViewMode();
  applyCaseStudyMode();
  scrollToPageTop();
}

function handleCaseLayoutResize() {
  if (!state.inCaseStudy) return;
  if (!isMobileCaseLayout()) {
    state.mobileInfoCollapsed = false;
  }
  applyMobileInfoState();
}

function initScrollReveal() {
  const nodes = document.querySelectorAll(".reveal");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nodes.forEach((node) => node.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: "0px 0px -4% 0px" },
  );
  nodes.forEach((node) => observer.observe(node));
}

function wireHeaderGlassEffect() {
  const threshold = 12;
  const setScrolled = (scroll) => {
    els.siteHeader.classList.toggle("scrolled", scroll > threshold);
  };

  if (lenisInstance) {
    lenisInstance.on("scroll", ({ scroll }) => setScrolled(scroll));
    setScrolled(lenisInstance.scroll);
  } else {
    const onScroll = () => setScrolled(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
}

function scrollToPageTop() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    return;
  }
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { duration: 1.05 });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function initAnchorNavigation() {
  const headerOffset = 80;
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      if (lenisInstance) {
        lenisInstance.scrollTo(target, { offset: -headerOffset, duration: 1.2 });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });
}

function resetCaseTopImageParallax() {
  const img = els.caseSlideTrack.querySelector(".case-stack-card.is-top img");
  if (img) {
    img.style.setProperty("--img-parallax-x", "0px");
    img.style.setProperty("--img-parallax-y", "0px");
  }
}

function onCaseSlideTrackParallax(event) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const topCard = els.caseSlideTrack.querySelector(".case-stack-card.is-top");
  if (!topCard || topCard.classList.contains("dragging")) {
    resetCaseTopImageParallax();
    return;
  }
  const img = topCard.querySelector("img");
  if (!img) return;
  const rect = els.caseSlideTrack.getBoundingClientRect();
  const nx = (event.clientX - rect.left) / rect.width - 0.5;
  const ny = (event.clientY - rect.top) / rect.height - 0.5;
  const max = 13;
  img.style.setProperty("--img-parallax-x", `${-nx * max * 2}px`);
  img.style.setProperty("--img-parallax-y", `${-ny * max * 2}px`);
}

let caseParallaxWired = false;

function initCaseImageParallax() {
  if (caseParallaxWired) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  caseParallaxWired = true;
  els.caseSlideTrack.addEventListener("pointermove", onCaseSlideTrackParallax);
  els.caseSlideTrack.addEventListener("pointerleave", resetCaseTopImageParallax);
}

function initLenisSmoothScroll() {
  lenisInstance = null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof window.Lenis !== "function") return;

  lenisInstance = new window.Lenis({
    duration: 1.2,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 0.92,
    touchMultiplier: 1,
    easing: (value) => Math.min(1, 1.001 - 2 ** (-10 * value)),
  });

  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

els.langViBtn.addEventListener("click", () => switchLanguage("vi"));
els.langEnBtn.addEventListener("click", () => switchLanguage("en"));
els.viewGalleryBtn.addEventListener("click", () => switchViewMode("gallery"));
els.viewIndexBtn.addEventListener("click", () => switchViewMode("index"));
els.caseBackBtn.addEventListener("click", closeCaseStudy);
els.caseInfoToggleBtn.addEventListener("click", () => {
  state.mobileInfoCollapsed = !state.mobileInfoCollapsed;
  applyMobileInfoState();
});
els.nextProjectBtn.addEventListener("click", goToNextProject);
els.caseSlidePrevBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  goToPrevCaseSlide();
});
els.caseSlideNextBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  goToNextCaseSlide();
});
els.caseStudyView.addEventListener("click", (event) => {
  if (event.target === els.caseStudyView) {
    closeCaseStudy();
  }
});

async function initializeApp() {
  await ensureProjectDetailImages(getSelectedProject());
  renderStaticText();
  renderGallery();
  renderIndexTable();
  applyViewMode();
  applyCaseStudyMode();
  initLenisSmoothScroll();
  wireHeaderGlassEffect();
  initAnchorNavigation();
  initScrollReveal();
  initCaseImageParallax();
  window.addEventListener("resize", handleCaseLayoutResize);
}

initializeApp();
