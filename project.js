const pageI18n = {
  vi: {
    back: "Back",
    nextProject: "Next project",
    metaDate: "Date",
    metaWebsite: "Website",
    metaTypeface: "Typeface",
    metaCommissioned: "Commissioned by",
    notFound: "Khong tim thay du an.",
  },
  en: {
    back: "Back",
    nextProject: "Next project",
    metaDate: "Date",
    metaWebsite: "Website",
    metaTypeface: "Typeface",
    metaCommissioned: "Commissioned by",
    notFound: "Project not found.",
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
  detailUrl.searchParams.set("fromView", pageState.returnView);
  detailUrl.searchParams.set("fromScroll", String(pageState.returnScroll));
  detailUrl.searchParams.set("selected", slug);
  return detailUrl.toString();
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

function buildMetaMarkup(project) {
  const text = pageI18n[pageState.language];
  const website = project.website || "-";
  const typeface = project.typeface || "-";
  const commissionedBy = project.commissionedBy || project.client || "-";

  return `
    <div class="project-meta-card">
      <h1>${project.name}</h1>
      <p class="project-meta-body">${project.description?.[pageState.language] || project.description?.en || ""}</p>
      <div class="project-meta-facts">
        <p><span>${text.metaDate}</span><strong>${project.year}</strong></p>
        <p><span>${text.metaWebsite}</span><strong>${website}</strong></p>
        <p><span>${text.metaTypeface}</span><strong>${typeface}</strong></p>
        <p><span>${text.metaCommissioned}</span><strong>${commissionedBy}</strong></p>
      </div>
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
    wrapper.innerHTML = `<img src="${slide.path}" alt="${slide.alt}" loading="lazy" decoding="async" />`;
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
  pageEls.gallery.innerHTML = `<article class="project-empty">${pageI18n[pageState.language].notFound}</article>`;
  updateCounter(0);
}

function renderSequence() {
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
  });
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
  const backUrl = new URL("./index.html", window.location.href);
  backUrl.searchParams.set("lang", pageState.language);
  backUrl.searchParams.set("view", pageState.returnView);
  backUrl.searchParams.set("scroll", String(pageState.returnScroll));
  backUrl.searchParams.set("selected", pageState.currentSlug);
  pageEls.backLink.href = backUrl.toString();
  const nextSlug = getNextProjectSlug();
  pageEls.nextLink.href = nextSlug ? buildProjectUrl(nextSlug) : pageEls.nextLink.href;
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
  wireHorizontalWheel();
  renderPage();
}

initializePage();
