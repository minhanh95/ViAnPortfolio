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
  projects: Array.isArray(window.VANLAB_PROJECTS)
    ? [...window.VANLAB_PROJECTS].filter((project) => project.slug !== "ps-iris").sort((a, b) => b.year - a.year)
    : [],
  currentSlug: "",
  returnSelectedSlug: "",
  returnView: "feature",
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
  const returnView = query.get("fromView") === "index" ? "index" : "feature";
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
  detailUrl.searchParams.set("theme", window.VANLAB_THEME?.get() ?? "light");
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

function renderInlineRichText(input) {
  const source = String(input ?? "");
  const tokenRegex = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*)/g;
  let result = "";
  let cursor = 0;
  let match = tokenRegex.exec(source);

  while (match) {
    const [token] = match;
    const start = match.index;
    if (start > cursor) result += escapeHtml(source.slice(cursor, start));

    const linkMatch = token.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      result += `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
    } else if (token.startsWith("**") && token.endsWith("**")) {
      result += `<strong>${escapeHtml(token.slice(2, -2))}</strong>`;
    } else {
      result += escapeHtml(token);
    }

    cursor = start + token.length;
    match = tokenRegex.exec(source);
  }

  if (cursor < source.length) result += escapeHtml(source.slice(cursor));
  return result;
}

function isVideoPath(path) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(path || "");
}

function isVimeoPath(path) {
  return /vimeo\.com/i.test(path || "");
}

function isYouTubePath(path) {
  return /(youtube\.com|youtu\.be)/i.test(path || "");
}

function isTikTokPath(path) {
  return /(tiktok\.com|vm\.tiktok\.com)/i.test(path || "");
}

function normalizeExternalMediaUrl(path) {
  if (!path) return "";
  try {
    const source = new URL(path, window.location.href);
    return `${source.origin}${source.pathname}`.toLowerCase();
  } catch {
    return String(path || "").trim().toLowerCase();
  }
}

function getTikTokPosterUrl(path) {
  const normalized = normalizeExternalMediaUrl(path);
  const posterMap = {
    "https://www.tiktok.com/@chuyengiaps/video/7614063566223707412":
      "assets/projects/ps/tiktok-thumb-01.jpg",
    "https://www.tiktok.com/@chuyengiaps/video/7613670887778209045":
      "assets/projects/ps/tiktok-thumb-02.jpg",
    "https://www.tiktok.com/@chuyengiaps/video/7613602035212029204":
      "assets/projects/ps/tiktok-thumb-03.jpg",
  };
  return posterMap[normalized] || "";
}

function buildVimeoEmbedUrl(path) {
  if (!path) return "";
  try {
    const source = new URL(path, window.location.href);
    const host = source.hostname.toLowerCase();
    let videoId = "";
    let hash = source.searchParams.get("h") || "";

    if (host.includes("player.vimeo.com")) {
      const parts = source.pathname.split("/").filter(Boolean);
      videoId = parts[parts.indexOf("video") + 1] || "";
    } else {
      const parts = source.pathname.split("/").filter(Boolean);
      videoId = parts[0] || "";
      if (!hash && parts[1]) hash = parts[1];
    }

    if (!videoId) return path;
    const embed = new URL(`https://player.vimeo.com/video/${videoId}`);
    if (hash) embed.searchParams.set("h", hash);
    embed.searchParams.set("api", "1");
    embed.searchParams.set("muted", "1");
    embed.searchParams.set("autopause", "0");
    embed.searchParams.set("playsinline", "1");
    return embed.toString();
  } catch {
    return path;
  }
}

function parseYouTubeVideoId(path) {
  if (!path) return "";
  try {
    const source = new URL(path, window.location.href);
    const host = source.hostname.toLowerCase();
    if (host.includes("youtu.be")) {
      return source.pathname.split("/").filter(Boolean)[0] || "";
    }
    if (host.includes("youtube.com")) {
      if (source.pathname.startsWith("/watch")) {
        return source.searchParams.get("v") || "";
      }
      if (source.pathname.startsWith("/embed/") || source.pathname.startsWith("/shorts/")) {
        return source.pathname.split("/").filter(Boolean)[1] || "";
      }
    }
    return "";
  } catch {
    return "";
  }
}

function buildYouTubeOpenUrl(path) {
  if (!path) return "";
  try {
    return new URL(path, window.location.href).href;
  } catch {
    return path;
  }
}

function buildYouTubePosterSlideHtml(path, altText) {
  const href = escapeHtml(buildYouTubeOpenUrl(path));
  const labelEsc = escapeHtml(altText);
  const id = parseYouTubeVideoId(path);
  const maxUrl = id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : "";
  const hqUrl = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
  const onMaxFail = maxUrl && hqUrl ? escapeHtml(`this.onerror=null;this.src='${hqUrl}'`) : "";
  const onMaxLoadCheck =
    maxUrl && hqUrl
      ? escapeHtml(`this.onload=null;if(this.naturalWidth<400)this.src='${hqUrl}'`)
      : "";
  const thumb = maxUrl
    ? `<img src="${escapeHtml(maxUrl)}" onload="${onMaxLoadCheck}" onerror="${onMaxFail}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`
    : "";
  return `<a class="project-slide-media project-slide-media--youtube" href="${href}" target="_blank" rel="noopener noreferrer" title="${labelEsc}" aria-label="${labelEsc}, YouTube">
    <span class="project-slide-youtube-poster">${thumb}<span class="project-slide-youtube-play" aria-hidden="true"></span></span>
  </a>`;
}

function buildTikTokPosterSlideHtml(path, altText) {
  const href = escapeHtml(path);
  const labelEsc = escapeHtml(altText);
  const posterUrl = getTikTokPosterUrl(path);
  const poster = posterUrl
    ? `<img src="${escapeHtml(posterUrl)}" alt="" loading="lazy" decoding="async" />`
    : "";
  return `<a class="project-slide-media project-slide-media--youtube" href="${href}" target="_blank" rel="noopener noreferrer" title="${labelEsc}" aria-label="${labelEsc}, TikTok">
    <span class="project-slide-youtube-poster">${poster}<span class="project-slide-youtube-play" aria-hidden="true"></span></span>
  </a>`;
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
    .map((block) => `<p class="project-meta-body">${renderInlineRichText(block).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function classifyMetaCopyDensity(raw, lang) {
  const source = raw?.[lang] || raw?.en || "";
  const normalized = String(source)
    .replace(/\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  const len = normalized.length;
  if (len <= 700) return "short";
  if (len <= 1300) return "medium";
  return "long";
}

function buildDeliverableSection(project, lang, label) {
  const block = project.deliverable?.[lang] || project.deliverable?.en;
  if (!block) return "";
  const rawLead = typeof block.lead === "string" ? block.lead.trim() : "";
  const normalizedLead = rawLead.toLowerCase();
  const normalizedLabel = String(label || "").trim().toLowerCase();
  const isDuplicateLead =
    normalizedLead &&
    (normalizedLead === normalizedLabel || normalizedLead === `${normalizedLabel}s` || normalizedLead === `${normalizedLabel}es`);
  const lead =
    rawLead && !isDuplicateLead ? `<p class="project-meta-deliverable-lead">${renderInlineRichText(rawLead)}</p>` : "";
  const groups = Array.isArray(block.groups) ? block.groups : [];
  const groupsHtml = groups
    .map((g) => {
      const title = String(g.title || "").trim();
      const titleHtml = title ? `<h3 class="project-meta-deliverable-subtitle">${renderInlineRichText(title)}</h3>` : "";
      const items = (Array.isArray(g.items) ? g.items : [])
        .map((item) => `<li>${renderInlineRichText(item)}</li>`)
        .join("");
      return `<div class="project-meta-deliverable-group">${titleHtml}<ul class="project-meta-deliverable-list">${items}</ul></div>`;
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
  const copyDensity = classifyMetaCopyDensity(project.description, lang);

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
  const deliverableLabel = pickLocalizedField(project.deliverableLabel, lang).trim() || text.metaDeliverable;
  const deliverableHtml = buildDeliverableSection(project, lang, deliverableLabel);

  return `
    <div class="project-meta-card project-meta-card--${copyDensity}">
      <h1>${escapeHtml(project.name)}</h1>
      <div class="project-meta-layout">
        <div class="project-meta-col project-meta-col--left">
          <div class="project-meta-facts">${factRows.join("")}</div>
        </div>
        <div class="project-meta-col project-meta-col--right">
          <section class="project-meta-description-block" aria-label="${escapeHtml(text.metaDescription)}">
            <h2 class="project-meta-section-title">${escapeHtml(text.metaDescription)}</h2>
            ${descHtml || "<p class=\"project-meta-body\">—</p>"}
          </section>
          ${deliverableHtml}
        </div>
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
    const src = escapeHtml(slide.path);
    const label = escapeHtml(slide.alt);
    const captionText = String(slide.caption || "").trim();
    const captionHtml = `<figcaption class="project-slide-caption">${renderInlineRichText(captionText)}</figcaption>`;
    if (isVideoPath(slide.path)) {
      wrapper.innerHTML = `<video class="project-slide-media" src="${src}" controls playsinline muted preload="metadata" title="${label}"></video>${captionHtml}`;
    } else if (isVimeoPath(slide.path)) {
      const embedSrc = escapeHtml(buildVimeoEmbedUrl(slide.path));
      wrapper.innerHTML = `<iframe class="project-slide-media project-slide-media--embed" src="${embedSrc}" title="${label}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>${captionHtml}`;
    } else if (isYouTubePath(slide.path)) {
      wrapper.innerHTML = `${buildYouTubePosterSlideHtml(slide.path, slide.alt)}${captionHtml}`;
    } else if (isTikTokPath(slide.path)) {
      wrapper.innerHTML = `${buildTikTokPosterSlideHtml(slide.path, slide.alt)}${captionHtml}`;
    } else {
      wrapper.innerHTML = `<img src="${src}" alt="${label}" loading="lazy" decoding="async" />${captionHtml}`;
    }
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

function setEmbedPlayback(frame, shouldPlay) {
  if (!frame?.contentWindow || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const src = String(frame.getAttribute("src") || "");
  if (src.includes("player.vimeo.com")) {
    frame.contentWindow.postMessage({ method: shouldPlay ? "play" : "pause" }, "https://player.vimeo.com");
    return;
  }
  if (src.includes("youtube.com/embed/")) {
    frame.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: shouldPlay ? "playVideo" : "pauseVideo", args: [] }),
      "https://www.youtube.com",
    );
  }
}

function wireProjectVideoPause() {
  if (pageState.videoObserver) {
    pageState.videoObserver.disconnect();
    pageState.videoObserver = null;
  }
  const mediaEls = pageEls.gallery.querySelectorAll("video.project-slide-media, iframe.project-slide-media--embed");
  if (!mediaEls.length) return;
  pageState.videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const media = entry.target;
        const inView = entry.isIntersecting && entry.intersectionRatio >= PROJECT_VIDEO_IN_VIEW_MIN;
        if (media instanceof HTMLVideoElement) {
          if (inView) tryPlayProjectVideo(media);
          else media.pause();
          return;
        }
        if (media instanceof HTMLIFrameElement) {
          setEmbedPlayback(media, inView);
        }
      });
    },
    { root: pageEls.gallery, threshold: [0, 0.25, PROJECT_VIDEO_IN_VIEW_MIN, 0.5, 0.65, 0.85] },
  );
  mediaEls.forEach((media) => pageState.videoObserver.observe(media));
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
  const backPage = pageState.returnView === "index" ? "./projects.html" : "./index.html";
  const backUrl = new URL(backPage, window.location.href);
  backUrl.searchParams.set("lang", pageState.language);
  backUrl.searchParams.set("theme", window.VANLAB_THEME.get());
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
  const localizedDescriptions = Array.isArray(project.detailDescriptions?.[pageState.language])
    ? project.detailDescriptions[pageState.language]
    : Array.isArray(project.detailDescriptions?.en)
      ? project.detailDescriptions.en
      : [];
  pageState.imageCount = orderedImages.length;

  pageState.sequence = [
    { type: "meta", html: buildMetaMarkup(project), counterIndex: -1 },
    ...orderedImages.map((path, index) => ({
      type: "image",
      path,
      alt:
        String(localizedDescriptions[index] || "").trim() ||
        `${project.name} ${index === 0 ? "cover" : `detail ${index}`}`,
      caption: String(localizedDescriptions[index] || "").trim(),
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

