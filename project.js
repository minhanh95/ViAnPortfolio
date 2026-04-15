const pageI18n = {
  vi: {
    back: "Quay lại",
    nextProject: "Dự án tiếp theo",
    metaYear: "Năm",
    metaClient: "Khách hàng",
    metaObjective: "Mục tiêu",
    metaScope: "Phạm vi công việc",
    metaDescription: "Mô tả",
    metaDeliverable: "Bàn giao",
    metaWebsite: "Website",
    metaTypeface: "Kiểu chữ",
    notFound: "Không tìm thấy dự án.",
    themeToggleLabel: "Đổi giao diện",
    themeDarkShort: "Tối",
    themeLightShort: "Sáng",
  },
  en: {
    back: "Back",
    nextProject: "Next project",
    metaYear: "Year",
    metaClient: "Client",
    metaObjective: "Objective",
    metaScope: "Scope of work",
    metaDescription: "Description",
    metaDeliverable: "Deliverable",
    metaWebsite: "Website",
    metaTypeface: "Typeface",
    notFound: "Project not found.",
    themeToggleLabel: "Switch theme",
    themeDarkShort: "Dark",
    themeLightShort: "Light",
  },
};

const pageState = {
  language: "en",
  projects: Array.isArray(window.VANLAB_PROJECTS) ? [...window.VANLAB_PROJECTS].sort((a, b) => b.year - a.year) : [],
  currentSlug: "",
  returnSelectedSlug: "",
  returnView: "gallery",
  returnScroll: 0,
  sequence: [],
  imageCount: 0,
  counterObserver: null,
  videoObserver: null,
  setStart: 0,
  setWidth: 0,
  velocity: 0,
  momentumRaf: null,
  lastWheelAt: Date.now(),
};
const LANGUAGE_STORAGE_KEY = "vanlab-language";

const SCROLL_PHYSICS = {
  MIN_DELTA_TIME: 16,
  MAX_SCROLL_INPUT: 60,
  VELOCITY_MULTIPLIER: 0.1,
  MAX_VELOCITY: 1,
  MIN_VELOCITY: 0.001,
  MOMENTUM_DECAY: 0.97,
  VELOCITY_TO_PIXEL: 42,
};

const pageEls = {
  counter: document.getElementById("projectCounter"),
  gallery: document.getElementById("projectGallery"),
  backLink: document.getElementById("projectBackLink"),
  nextLink: document.getElementById("projectNextLink"),
  langViBtn: document.getElementById("langViBtn"),
  langEnBtn: document.getElementById("langEnBtn"),
  themeToggleBtn: document.getElementById("themeToggleBtn"),
};

function getQueryLanguage() {
  const query = new URLSearchParams(window.location.search);
  const queryLang = query.get("lang");
  if (queryLang === "vi" || queryLang === "en") return queryLang;
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === "vi" || stored === "en") return stored;
  return "en";
}

function getReturnContext() {
  const query = new URLSearchParams(window.location.search);
  const returnSelectedSlug = query.get("selected") || "";
  const returnView = query.get("fromView") === "index" ? "index" : "gallery";
  const rawScroll = Number(query.get("fromScroll"));
  const returnScroll = Number.isFinite(rawScroll) && rawScroll >= 0 ? Math.round(rawScroll) : 0;
  return { returnSelectedSlug, returnView, returnScroll };
}

function updateStaticText() {
  pageEls.backLink.textContent = pageI18n[pageState.language].back;
  pageEls.nextLink.textContent = pageI18n[pageState.language].nextProject;
  pageEls.langViBtn?.classList.toggle("active", pageState.language === "vi");
  pageEls.langEnBtn?.classList.toggle("active", pageState.language === "en");
  updateThemeToggleUi();
}

function getNextProjectSlug() {
  if (!pageState.projects.length) return "";
  const currentIndex = pageState.projects.findIndex((item) => item.slug === pageState.currentSlug);
  if (currentIndex < 0) return pageState.projects[0]?.slug || "";
  return pageState.projects[(currentIndex + 1) % pageState.projects.length]?.slug || "";
}

function buildProjectUrl(slug) {
  const detailUrl = new URL("./project.html", window.location.href);
  detailUrl.searchParams.set("slug", slug);
  detailUrl.searchParams.set("lang", pageState.language);
  detailUrl.searchParams.set("theme", window.VANLAB_THEME?.get() ?? "dark");
  detailUrl.searchParams.set("fromView", pageState.returnView);
  detailUrl.searchParams.set("fromScroll", String(pageState.returnScroll));
  detailUrl.searchParams.set("selected", slug);
  return detailUrl.toString();
}

function updateThemeToggleUi() {
  if (!pageEls.themeToggleBtn || !window.VANLAB_THEME) return;
  const dict = pageI18n[pageState.language] || pageI18n.en;
  pageEls.themeToggleBtn.textContent = "";
  pageEls.themeToggleBtn.title = dict.themeToggleLabel;
  pageEls.themeToggleBtn.setAttribute("aria-label", dict.themeToggleLabel);
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

async function resolveDetailImages(project) {
  if (!project) return [];
  if (project.detailImages?.length) {
    return project.detailImages;
  }
  const folder = getFolderPath(project.coverPath);
  const detailImages = [];
  let foundAny = false;

  for (let index = 1; index <= 20; index += 1) {
    const numbered = `${folder}/detail-${String(index).padStart(2, "0")}.jpg`;
    const exists = await checkImageExists(numbered);
    if (exists) {
      detailImages.push(numbered);
      foundAny = true;
      continue;
    }
    if (foundAny || index === 1) break;
  }

  return detailImages;
}

function updateCounter(activeIndex) {
  const safeCurrent = String(Math.max(0, activeIndex) + 1).padStart(2, "0");
  const safeTotal = String(pageState.imageCount || 1).padStart(2, "0");
  pageEls.counter.textContent = `${safeCurrent}/${safeTotal}`;
}

function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isVideoPath(path) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(path || "");
}

function pickLocalizedField(value, lang) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || "";
}

function getScopeLines(scope, lang) {
  if (!scope) return [];
  if (Array.isArray(scope)) return scope;
  const lines = scope[lang] || scope.en;
  return Array.isArray(lines) ? lines : [];
}

function buildDescriptionParagraphs(raw, lang) {
  const text = raw?.[lang] || raw?.en || "";
  if (!text.trim()) return "";
  return text
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p class="project-meta-body">${escapeHtml(block).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function buildDeliverableSection(project, lang, label) {
  const block = project.deliverable?.[lang] || project.deliverable?.en;
  if (!block) return "";
  const lead = typeof block.lead === "string" && block.lead.trim() ? `<p class="project-meta-deliverable-lead">${escapeHtml(block.lead)}</p>` : "";
  const groups = Array.isArray(block.groups) ? block.groups : [];
  const groupsHtml = groups
    .map((g) => {
      const title = escapeHtml(g.title || "");
      const items = (Array.isArray(g.items) ? g.items : []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
      return `<div class="project-meta-deliverable-group"><h3 class="project-meta-deliverable-subtitle">${title}</h3><ul class="project-meta-deliverable-list">${items}</ul></div>`;
    })
    .join("");
  return `
    <section class="project-meta-deliverable" aria-label="${escapeHtml(label)}">
      <h2 class="project-meta-section-title">${escapeHtml(label)}</h2>
      ${lead}
      <div class="project-meta-deliverable-groups">${groupsHtml}</div>
    </section>
  `;
}

function buildMetaMarkup(project) {
  const lang = pageState.language;
  const text = pageI18n[lang];

  const objective = pickLocalizedField(project.objective, lang).trim();
  const scopeLines = getScopeLines(project.scopeOfWork, lang);

  const factRows = [];
  factRows.push(
    `<div class="project-meta-fact"><span class="project-meta-fact-label">${escapeHtml(text.metaYear)}</span><strong class="project-meta-fact-value">${escapeHtml(String(project.year))}</strong></div>`,
  );
  factRows.push(
    `<div class="project-meta-fact"><span class="project-meta-fact-label">${escapeHtml(text.metaClient)}</span><strong class="project-meta-fact-value">${escapeHtml(project.client || "—")}</strong></div>`,
  );
  if (objective) {
    factRows.push(
      `<div class="project-meta-fact"><span class="project-meta-fact-label">${escapeHtml(text.metaObjective)}</span><strong class="project-meta-fact-value">${escapeHtml(objective)}</strong></div>`,
    );
  }
  if (scopeLines.length) {
    const scopeHtml = scopeLines.map((line) => escapeHtml(line)).join("<br />");
    factRows.push(
      `<div class="project-meta-fact"><span class="project-meta-fact-label">${escapeHtml(text.metaScope)}</span><strong class="project-meta-fact-value project-meta-fact-value--block">${scopeHtml}</strong></div>`,
    );
  }
  if (project.website) {
    factRows.push(
      `<div class="project-meta-fact"><span class="project-meta-fact-label">${escapeHtml(text.metaWebsite)}</span><strong class="project-meta-fact-value">${escapeHtml(project.website)}</strong></div>`,
    );
  }
  if (project.typeface) {
    factRows.push(
      `<div class="project-meta-fact"><span class="project-meta-fact-label">${escapeHtml(text.metaTypeface)}</span><strong class="project-meta-fact-value">${escapeHtml(project.typeface)}</strong></div>`,
    );
  }

  const descHtml = buildDescriptionParagraphs(project.description, lang);
  const deliverableHtml = buildDeliverableSection(project, lang, text.metaDeliverable);

  return `
    <div class="project-meta-card">
      <h1>${escapeHtml(project.name)}</h1>
      <div class="project-meta-facts">${factRows.join("")}</div>
      <section class="project-meta-description-block" aria-label="${escapeHtml(text.metaDescription)}">
        <h2 class="project-meta-section-title">${escapeHtml(text.metaDescription)}</h2>
        ${descHtml || "<p class=\"project-meta-body\">—</p>"}
      </section>
      ${deliverableHtml}
    </div>
  `;
}

function createSlide(slide, realIndex, cloneSet) {
  const wrapper = document.createElement(slide.type === "meta" ? "article" : "figure");
  wrapper.className = `project-slide ${slide.type === "meta" ? "project-slide--meta" : "project-slide--image"}`;
  wrapper.dataset.realIndex = String(realIndex);
  wrapper.dataset.cloneSet = String(cloneSet);
  wrapper.dataset.counterIndex = String(slide.counterIndex ?? -1);
  wrapper.dataset.countable = slide.counterIndex >= 0 ? "true" : "false";

  if (slide.type === "meta") {
    wrapper.innerHTML = slide.html;
  } else {
    const src = escapeHtml(slide.path);
    const label = escapeHtml(slide.alt);
    wrapper.innerHTML = isVideoPath(slide.path)
      ? `<video class="project-slide-media" src="${src}" controls playsinline muted preload="metadata" title="${label}"></video>`
      : `<img src="${src}" alt="${label}" loading="lazy" decoding="async" />`;
  }
  return wrapper;
}

function recenterIfNeeded() {
  if (!pageState.setWidth) return;
  // Keep the viewport around the middle clone set so both directions
  // can wrap infinitely even when a project has only a cover image.
  const min = pageState.setStart - pageState.setWidth * 0.25;
  const max = pageState.setStart + pageState.setWidth * 0.75;
  let guard = 0;

  while (pageEls.gallery.scrollLeft < min && guard < 3) {
    pageEls.gallery.scrollLeft += pageState.setWidth;
    guard += 1;
  }
  while (pageEls.gallery.scrollLeft > max && guard < 6) {
    pageEls.gallery.scrollLeft -= pageState.setWidth;
    guard += 1;
  }
}

function wireCounterObserver() {
  if (pageState.counterObserver) {
    pageState.counterObserver.disconnect();
    pageState.counterObserver = null;
  }

  const slides = Array.from(pageEls.gallery.querySelectorAll('.project-slide[data-countable="true"]'));
  if (!slides.length) {
    updateCounter(0);
    return;
  }

  pageState.counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.6) return;
        const counterIndex = Number(entry.target.dataset.counterIndex || -1);
        if (counterIndex < 0) return;
        updateCounter(counterIndex);
      });
    },
    { root: pageEls.gallery, threshold: [0.6, 0.85] },
  );

  slides.forEach((slide) => pageState.counterObserver.observe(slide));
}

const PROJECT_VIDEO_IN_VIEW_MIN = 0.45;

function tryPlayProjectVideo(video) {
  if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const p = video.play();
  if (p && typeof p.catch === "function") p.catch(() => {});
}

function wireProjectVideoPause() {
  if (pageState.videoObserver) {
    pageState.videoObserver.disconnect();
    pageState.videoObserver = null;
  }
  const videos = pageEls.gallery.querySelectorAll("video.project-slide-media");
  if (!videos.length) return;
  pageState.videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        const inView = entry.isIntersecting && entry.intersectionRatio >= PROJECT_VIDEO_IN_VIEW_MIN;
        if (inView) tryPlayProjectVideo(video);
        else video.pause();
      });
    },
    { root: pageEls.gallery, threshold: [0, 0.25, PROJECT_VIDEO_IN_VIEW_MIN, 0.5, 0.65, 0.85] },
  );
  videos.forEach((video) => pageState.videoObserver.observe(video));
}

function runMomentum() {
  if (Math.abs(pageState.velocity) <= SCROLL_PHYSICS.MIN_VELOCITY) {
    pageState.velocity = 0;
    if (pageState.momentumRaf) {
      cancelAnimationFrame(pageState.momentumRaf);
      pageState.momentumRaf = null;
    }
    return;
  }

  pageState.velocity *= SCROLL_PHYSICS.MOMENTUM_DECAY;
  pageEls.gallery.scrollLeft += pageState.velocity * SCROLL_PHYSICS.VELOCITY_TO_PIXEL;
  recenterIfNeeded();
  pageState.momentumRaf = requestAnimationFrame(runMomentum);
}

function queueMomentumFromWheel(event) {
  const now = Date.now();
  const dt = Math.max(SCROLL_PHYSICS.MIN_DELTA_TIME, now - pageState.lastWheelAt);
  pageState.lastWheelAt = now;

  const isMicroInput = Math.abs(event.deltaX) < 50 && Math.abs(event.deltaY) < 50;
  let delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  if (isMicroInput) delta *= 0.5;

  delta = Math.sign(delta) * Math.min(Math.abs(delta), SCROLL_PHYSICS.MAX_SCROLL_INPUT);
  const velocityMultiplier = isMicroInput ? SCROLL_PHYSICS.VELOCITY_MULTIPLIER * 0.5 : SCROLL_PHYSICS.VELOCITY_MULTIPLIER;
  pageState.velocity += (delta / dt) * velocityMultiplier;

  const maxVelocity = isMicroInput ? SCROLL_PHYSICS.MAX_VELOCITY * 0.5 : SCROLL_PHYSICS.MAX_VELOCITY;
  pageState.velocity = Math.max(-maxVelocity, Math.min(maxVelocity, pageState.velocity));

  if (!pageState.momentumRaf) {
    pageState.momentumRaf = requestAnimationFrame(runMomentum);
  }
}

function wireHorizontalWheel() {
  pageEls.gallery.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      queueMomentumFromWheel(event);
    },
    { passive: false },
  );

  pageEls.gallery.addEventListener("scroll", recenterIfNeeded, { passive: true });
}

function renderNotFound() {
  if (pageState.videoObserver) {
    pageState.videoObserver.disconnect();
    pageState.videoObserver = null;
  }
  pageEls.gallery.innerHTML = `<article class="project-empty">${pageI18n[pageState.language].notFound}</article>`;
  updateCounter(0);
}

function renderSequence() {
  if (pageState.videoObserver) {
    pageState.videoObserver.disconnect();
    pageState.videoObserver = null;
  }
  pageEls.gallery.innerHTML = "";
  [-1, 0, 1].forEach((cloneSet) => {
    pageState.sequence.forEach((slide, realIndex) => {
      const node = createSlide(slide, realIndex, cloneSet);
      pageEls.gallery.appendChild(node);
    });
  });

  requestAnimationFrame(() => {
    const middleSlides = Array.from(pageEls.gallery.querySelectorAll('.project-slide[data-clone-set="0"]'));
    if (!middleSlides.length) return;
    const first = middleSlides[0];
    const last = middleSlides[middleSlides.length - 1];
    const lastRight = last.offsetLeft + last.offsetWidth;
    pageState.setStart = first.offsetLeft;
    pageState.setWidth = lastRight - first.offsetLeft;
    // Open on intro frame: metadata + first image visible
    pageEls.gallery.scrollLeft = pageState.setStart;
    updateCounter(0);
    wireCounterObserver();
    wireProjectVideoPause();
  });
}

function updateOutboundNavLinks() {
  if (!window.VANLAB_THEME) return;
  const project = pageState.projects.find((item) => item.slug === pageState.currentSlug);
  if (!project) return;
  const backUrl = new URL("./index.html", window.location.href);
  backUrl.searchParams.set("lang", pageState.language);
  backUrl.searchParams.set("theme", window.VANLAB_THEME.get());
  backUrl.searchParams.set("view", pageState.returnView);
  backUrl.searchParams.set("scroll", String(pageState.returnScroll));
  backUrl.searchParams.set("selected", pageState.currentSlug);
  pageEls.backLink.href = backUrl.toString();
  const nextSlug = getNextProjectSlug();
  pageEls.nextLink.href = nextSlug ? buildProjectUrl(nextSlug) : pageEls.nextLink.href;
}

async function renderPage() {
  const project = pageState.projects.find((item) => item.slug === pageState.currentSlug);
  if (!project) {
    renderNotFound();
    return;
  }

  const details = await resolveDetailImages(project);
  const orderedImages = [project.coverPath, ...details.filter((path) => path !== project.coverPath)];
  pageState.imageCount = orderedImages.length;

  pageState.sequence = [
    { type: "meta", html: buildMetaMarkup(project), counterIndex: -1 },
    ...orderedImages.map((path, index) => ({
      type: "image",
      path,
      alt: `${project.name} ${index === 0 ? "cover" : `detail ${index}`}`,
      counterIndex: index,
    })),
  ];

  document.title = `${project.name} - VAN.LAB`;
  updateOutboundNavLinks();
  renderSequence();
}

function initializePage() {
  const query = new URLSearchParams(window.location.search);
  const { returnSelectedSlug, returnView, returnScroll } = getReturnContext();
  pageState.currentSlug = query.get("slug") || pageState.projects[0]?.slug || "";
  pageState.language = getQueryLanguage();
  localStorage.setItem(LANGUAGE_STORAGE_KEY, pageState.language);
  pageState.returnSelectedSlug = returnSelectedSlug || pageState.currentSlug;
  pageState.returnView = returnView;
  pageState.returnScroll = returnScroll;
  document.documentElement.lang = pageState.language;
  updateStaticText();
  function switchLanguage(language) {
    if (language !== "vi" && language !== "en") return;
    pageState.language = language;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, pageState.language);
    document.documentElement.lang = pageState.language;
    updateStaticText();
    updateOutboundNavLinks();
    const url = new URL(window.location.href);
    url.searchParams.set("lang", pageState.language);
    if (window.VANLAB_THEME) {
      url.searchParams.set("theme", window.VANLAB_THEME.get());
    }
    window.history.replaceState(window.history.state, "", url.toString());
    renderPage();
  }
  pageEls.langViBtn?.addEventListener("click", () => switchLanguage("vi"));
  pageEls.langEnBtn?.addEventListener("click", () => switchLanguage("en"));
  pageEls.themeToggleBtn?.addEventListener("click", () => {
    window.VANLAB_THEME?.toggle({ syncUrl: true });
  });
  window.addEventListener("vanlab-themechange", () => {
    updateThemeToggleUi();
    updateOutboundNavLinks();
  });
  wireHorizontalWheel();
  renderPage();
}

initializePage();

