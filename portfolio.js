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
    caseBack: "Back to list",
    caseInfoMore: "Show details",
    caseInfoLess: "Hide details",
    slidePrev: "Prev",
    slideNext: "Next",
    swipeHint: "Vuot trai / phai de xem anh tiep theo",
    caseInfoTechLabel: "Tech Stack:",
    caseInfoYearLabel: "Year:",
    nextProject: "Next Project",
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
    caseBack: "Back to list",
    caseInfoMore: "Show details",
    caseInfoLess: "Hide details",
    slidePrev: "Prev",
    slideNext: "Next",
    swipeHint: "Swipe left / right to view next image",
    caseInfoTechLabel: "Tech Stack:",
    caseInfoYearLabel: "Year:",
    nextProject: "Next Project",
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

const sortedProjects = [...projects].sort((a, b) => b.year - a.year);
const savedLanguage = localStorage.getItem("vanlab-language");
const defaultLanguage = savedLanguage === "en" ? "en" : "vi";

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
  caseSwipeHint: document.getElementById("caseSwipeHint"),
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
  els.caseBackBtn.textContent = t("caseBack");
  applyMobileInfoState();
  els.caseSwipeHint.textContent = t("swipeHint");
  els.caseInfoTechLabel.textContent = t("caseInfoTechLabel");
  els.caseInfoYearLabel.textContent = t("caseInfoYearLabel");
  els.nextProjectBtn.textContent = t("nextProject");

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
        <img src="${project.coverPath}" alt="${project.name} cover" loading="lazy" decoding="async" />
      </div>
      <div class="gallery-info">
        <div><p class="meta-label">${t("infoProject")}</p><p>${project.name} | ${getLocalizedValue(
      project.category,
    )}</p></div>
        <div><p class="meta-label">${t("infoTechnology")}</p><p>${project.technology}</p></div>
        <div><p class="meta-label">${t("infoYear")}</p><p>${project.year}</p></div>
      </div>
      <p class="gallery-description">${getLocalizedValue(project.description)}</p>
    `;
    item.addEventListener("click", () => openCaseStudy(project.slug));
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
      <p>${project.year} - ${getLocalizedValue(project.category)}</p>
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

  const signature = `${project.slug}:${slideImages.join("|")}`;
  if (els.caseSlideTrack.dataset.signature !== signature) {
    els.caseSlideTrack.dataset.signature = signature;
    els.caseSlideTrack.innerHTML = slideImages
      .map(
        (path, imageIndex) => `
          <figure
            class="case-stack-card"
            data-image-index="${imageIndex}"
            style="--card-x:0px; --card-scale:1; --card-opacity:1; --card-blur:0px; --card-ry:0deg; --card-z:1; --drag-x:0px; --drag-rot:0deg;"
          >
            <img src="${path}" alt="${project.name} detail ${imageIndex + 1}" loading="lazy" draggable="false" />
          </figure>`,
      )
      .join("");
    positionCaseCards(slideImages.length, false);
  } else {
    positionCaseCards(slideImages.length, true);
  }

  setupTopCardSwipe(slideImages.length);
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

  cards.forEach((card) => {
    const imageIndex = Number(card.dataset.imageIndex || 0);
    const offset = getCircularOffset(imageIndex, state.caseSlideIndex, totalImages);
    const visual = getStackCardVisual(offset, stepX);

    card.dataset.offset = String(offset);
    card.classList.toggle("is-top", offset === 0);
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
  window.setTimeout(() => {
    state.caseAnimating = false;
    setupTopCardSwipe(totalImages);
  }, 520);
}

function applyViewMode() {
  const isGallery = state.viewMode === "gallery";
  els.galleryView.classList.toggle("hidden", !isGallery);
  els.indexView.classList.toggle("hidden", isGallery);
}

function applyCaseStudyMode() {
  els.caseStudyView.classList.toggle("hidden", !state.inCaseStudy);
  document.body.classList.toggle("case-open", state.inCaseStudy);
  if (state.inCaseStudy) {
    applyMobileInfoState();
  }
}

async function openCaseStudy(slug) {
  setSelectedProject(slug);
  state.inCaseStudy = true;
  state.mobileInfoCollapsed = isMobileCaseLayout();
  applyCaseStudyMode();
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
  };

  topCard.addEventListener("pointerdown", onPointerDown);
  topCard.style.touchAction = "pan-y";
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerCancel);

  topCardSwipeCleanup = () => {
    topCard.removeEventListener("pointerdown", onPointerDown);
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

function initLenisSmoothScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof window.Lenis !== "function") return;

  const lenis = new window.Lenis({
    duration: 1.15,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.0,
    easing: (value) => Math.min(1, 1.001 - 2 ** (-10 * value)),
  });

  function raf(time) {
    lenis.raf(time);
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
  wireHeaderGlassEffect();
  initScrollReveal();
  initLenisSmoothScroll();
  window.addEventListener("resize", handleCaseLayoutResize);
}

initializeApp();
