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
  projectVideoUnwire: null,
  setStart: 0,
  setWidth: 0,
  velocity: 0,
  momentumRaf: null,
  lastWheelAt: Date.now(),
  hasUserInteracted: false,
  cachedMaxScale: 1.06,
  scaleAnimRaf: null,
};
const projectMediaWarmupCache = new Set();

/* Per-slide scale lerp parameters: 0.18 reaches ~99% of the target in ~25 frames (~0.4s @ 60Hz),
   which feels like a confident glide without lagging behind the user. SCALE_EPS controls when
   we snap to target and stop the rAF loop. Using a numeric .__currentScale / .__targetScale on
   the slide element avoids string parsing each frame. */
const SCALE_LERP = 0.18;
const SCALE_EPS = 0.0015;
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
const LANDSCAPE_MEDIA_RATIO = 1.2;
/** Taller than wide → use portrait frame (matches mobile / social video). */
const PORTRAIT_VIDEO_MAX_WH_RATIO = 0.95;
/** Only this project page uses the portrait slide resize (9:16 social clips). */
const PORTRAIT_VIDEO_PROJECT_SLUG = "vinamilk-green-farm";

const pageEls = {
  counter: document.getElementById("projectCounter"),
  gallery: document.getElementById("projectGallery"),
  backLink: document.getElementById("projectBackLink"),
  nextLink: document.getElementById("projectNextLink"),
  langToggleBtn: document.getElementById("langToggleBtn"),
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
  if (pageEls.langToggleBtn) {
    pageEls.langToggleBtn.textContent = pageState.language.toUpperCase();
    pageEls.langToggleBtn.setAttribute("aria-label", "Switch language");
    pageEls.langToggleBtn.title = "Switch language";
  }
  updateThemeToggleUi();
  window.VANLAB_REFRESH_FOOTER_BAR?.();
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
  detailUrl.searchParams.set("theme", getCurrentTheme());
  detailUrl.searchParams.set("fromView", pageState.returnView);
  detailUrl.searchParams.set("fromScroll", String(pageState.returnScroll));
  detailUrl.searchParams.set("selected", slug);
  return detailUrl.toString();
}

function getCurrentTheme() {
  return window.VANLAB_THEME?.get() || (document.documentElement.dataset.theme === "light" ? "light" : "dark");
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

function getVideoPosterPath(path) {
  if (!isVideoPath(path) || /^https?:\/\//i.test(path || "")) return "";
  return String(path).replace(/\.(mp4|webm|ogg|mov)(\?.*)?$/i, ".jpg");
}

function buildResponsiveImageTag(path, alt, options = {}) {
  const { loading = "lazy", fetchpriority = "auto", sizes = "(max-width: 900px) 84vw, 68vw", width = 1600, height = 1000 } = options;
  const src = escapeHtml(path);
  return `<img src="${src}" srcset="${src} 1x, ${src} 2x" sizes="${escapeHtml(sizes)}" width="${width}" height="${height}" alt="${escapeHtml(alt)}" loading="${loading}" decoding="async" fetchpriority="${fetchpriority}" />`;
}

function getRasterSourceVariants(path) {
  if (!path || /^https?:\/\//i.test(path) || !/\.(jpe?g|png)(\?.*)?$/i.test(path)) {
    return { avif: "", webp: "" };
  }
  const base = String(path).replace(/\.(jpe?g|png)(\?.*)?$/i, "");
  return {
    avif: `${base}.avif`,
    webp: `${base}.webp`,
  };
}

function buildResponsivePictureTag(path, alt, options = {}) {
  const { sizes = "(max-width: 900px) 84vw, 68vw" } = options;
  const variants = getRasterSourceVariants(path);
  return `<picture class="project-slide-picture">
    ${variants.avif ? `<source type="image/avif" srcset="${escapeHtml(variants.avif)} 1x, ${escapeHtml(variants.avif)} 2x" sizes="${escapeHtml(sizes)}" />` : ""}
    ${variants.webp ? `<source type="image/webp" srcset="${escapeHtml(variants.webp)} 1x, ${escapeHtml(variants.webp)} 2x" sizes="${escapeHtml(sizes)}" />` : ""}
    ${buildResponsiveImageTag(path, alt, options)}
  </picture>`;
}

function warmupProjectMediaPaths(paths, options = {}) {
  const { eager = false, maxItems = Number.POSITIVE_INFINITY } = options;
  const queue = Array.isArray(paths) ? paths.slice(0, maxItems) : [];
  const prime = (path) => {
    if (!path || projectMediaWarmupCache.has(path)) return;
    projectMediaWarmupCache.add(path);
    if (isVideoPath(path)) {
      const video = document.createElement("video");
      video.preload = "metadata";
      const poster = getVideoPosterPath(path);
      if (poster) video.poster = poster;
      video.src = path;
      return;
    }
    if (isYouTubePath(path) || isTikTokPath(path) || isFacebookPath(path) || isVimeoPath(path)) return;
    const variants = getRasterSourceVariants(path);
    const image = new Image();
    image.decoding = "async";
    image.loading = eager ? "eager" : "lazy";
    image.src = variants.avif || variants.webp || path;
  };
  queue.forEach((path) => {
    if (eager) {
      prime(path);
      return;
    }
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(() => prime(path), { timeout: 1200 });
      return;
    }
    window.setTimeout(() => prime(path), 180);
  });
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

function isFacebookPath(path) {
  return /(facebook\.com|fb\.watch)/i.test(path || "");
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

function buildFacebookEmbedUrl(path) {
  if (!path) return "";
  try {
    const source = new URL(path, window.location.href).href;
    const embed = new URL("https://www.facebook.com/plugins/video.php");
    embed.searchParams.set("href", source);
    embed.searchParams.set("show_text", "false");
    embed.searchParams.set("autoplay", "false");
    embed.searchParams.set("mute", "0");
    return embed.toString();
  } catch {
    return "";
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

function buildYouTubePosterSlideHtml(path, altText, customPosterPath) {
  const href = escapeHtml(buildYouTubeOpenUrl(path));
  const labelEsc = escapeHtml(altText);
  const custom = String(customPosterPath || "").trim();
  if (custom) {
    const posterSrc = escapeHtml(custom);
    return `<a class="project-slide-media project-slide-media--youtube" href="${href}" target="_blank" rel="noopener noreferrer" title="${labelEsc}" aria-label="${labelEsc}, YouTube">
    <span class="project-slide-youtube-poster"><img src="${posterSrc}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" /><span class="project-slide-youtube-play" aria-hidden="true"></span></span>
  </a>`;
  }
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

function getAssetFileName(path) {
  return String(path || "").split("/").pop() || "";
}

function getProjectDetailDisplayMode(project, path, index) {
  const modeMap = project?.detailDisplayMode;
  if (!modeMap || typeof modeMap !== "object") return "contain";
  const byName = String(modeMap[getAssetFileName(path)] || "").toLowerCase();
  if (byName === "cover-vertical") return "cover-vertical";
  if (byName === "cover") return "cover";
  const byIndex = String(modeMap[String(index + 1)] || "").toLowerCase();
  if (byIndex === "cover-vertical") return "cover-vertical";
  if (byIndex === "cover") return "cover";
  return "contain";
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
  if (slide.type === "image" && slide.displayMode === "cover-vertical") {
    wrapper.classList.add("project-slide--media-fill-vertical");
  }
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
      wrapper.classList.add("project-slide--has-video");
      // Manual playback only: no `autoplay`, no JS-driven play()/pause(). Keeping decoders idle
      // unless the user clicks play is the surest way to keep horizontal scroll silky on every
      // device — even mid-range laptops. `preload="metadata"` lets the slide show the first frame
      // without buffering the whole clip up front, and `controls` gives users the play button.
      const poster = getVideoPosterPath(slide.path);
      const posterAttr = poster ? ` poster="${escapeHtml(poster)}"` : "";
      wrapper.innerHTML = `<video class="project-slide-media" src="${src}" controls playsinline muted preload="metadata"${posterAttr} disablepictureinpicture disableremoteplayback title="${label}"></video>${captionHtml}`;
    } else if (isVimeoPath(slide.path)) {
      const embedSrc = escapeHtml(buildVimeoEmbedUrl(slide.path));
      wrapper.innerHTML = `<iframe class="project-slide-media project-slide-media--embed" src="${embedSrc}" title="${label}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>${captionHtml}`;
    } else if (isFacebookPath(slide.path)) {
      const embedSrc = escapeHtml(buildFacebookEmbedUrl(slide.path));
      if (embedSrc) {
        wrapper.innerHTML = `<iframe class="project-slide-media project-slide-media--embed" src="${embedSrc}" title="${label}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>${captionHtml}`;
      } else {
        wrapper.innerHTML = `<a class="project-slide-media project-slide-media--youtube" href="${src}" target="_blank" rel="noopener noreferrer">${label}</a>${captionHtml}`;
      }
    } else if (isYouTubePath(slide.path)) {
      const ytPoster = String(slide.youtubePosterPath || "").trim();
      wrapper.innerHTML = `${buildYouTubePosterSlideHtml(slide.path, slide.alt, ytPoster)}${captionHtml}`;
    } else if (isTikTokPath(slide.path)) {
      wrapper.innerHTML = `${buildTikTokPosterSlideHtml(slide.path, slide.alt)}${captionHtml}`;
    } else {
      wrapper.innerHTML = `<img src="${src}" alt="${label}" loading="lazy" decoding="async" />${captionHtml}`;
    }
  }
  return wrapper;
}

function applyLandscapeClassForImage(img) {
  if (!(img instanceof HTMLImageElement)) return;
  if (window.matchMedia("(min-width: 901px)").matches) return;
  const slide = img.closest(".project-slide--image");
  if (!slide || slide.classList.contains("project-slide--media-fill-vertical")) return;
  const naturalW = Number(img.naturalWidth || 0);
  const naturalH = Number(img.naturalHeight || 0);
  if (!naturalW || !naturalH) return;
  slide.classList.toggle("project-slide--media-landscape", naturalW / naturalH >= LANDSCAPE_MEDIA_RATIO);
}

function wireLandscapeMediaSizing() {
  const images = pageEls.gallery.querySelectorAll(".project-slide--image img");
  images.forEach((img) => {
    if (!(img instanceof HTMLImageElement)) return;
    if (img.complete) {
      applyLandscapeClassForImage(img);
      return;
    }
    img.addEventListener("load", () => applyLandscapeClassForImage(img), { once: true });
  });
}

function applyProjectPortraitVideoClass(video) {
  if (!(video instanceof HTMLVideoElement) || !pageEls.gallery) return;
  if (pageState.currentSlug !== PORTRAIT_VIDEO_PROJECT_SLUG) return;
  const srcSlide = video.closest('.project-slide--image.project-slide--has-video');
  if (!srcSlide) return;
  const realIndex = String(srcSlide.dataset.realIndex ?? "");
  const w = video.videoWidth;
  const h = video.videoHeight;
  if (!w || !h) return;
  const isPortrait = w / h < PORTRAIT_VIDEO_MAX_WH_RATIO;
  const sameSlides = pageEls.gallery.querySelectorAll(
    `.project-slide--image.project-slide--has-video[data-real-index="${realIndex}"]`,
  );
  sameSlides.forEach((slide) => {
    if (!(slide instanceof HTMLElement)) return;
    if (isPortrait) {
      slide.classList.add("project-slide--video-portrait");
      slide.style.setProperty("--project-portrait-aspect", `${w} / ${h}`);
    } else {
      slide.classList.remove("project-slide--video-portrait");
      slide.style.removeProperty("--project-portrait-aspect");
    }
  });
  requestAnimationFrame(() => {
    updateLoopMetrics();
    recenterIfNeeded();
  });
}

function wireProjectPortraitVideoAspect() {
  if (pageState.currentSlug !== PORTRAIT_VIDEO_PROJECT_SLUG) return;
  const videos = pageEls.gallery.querySelectorAll('video.project-slide-media');
  videos.forEach((video) => {
    if (!(video instanceof HTMLVideoElement)) return;
    if (video.readyState >= 1) {
      applyProjectPortraitVideoClass(video);
    } else {
      video.addEventListener("loadedmetadata", () => applyProjectPortraitVideoClass(video), { once: true });
    }
  });
}

function updateLoopMetrics() {
  const firstMiddle = pageEls.gallery.querySelector('.project-slide[data-clone-set="0"]');
  const firstNext = pageEls.gallery.querySelector('.project-slide[data-clone-set="1"]');
  if (!firstMiddle || !firstNext) return false;
  pageState.setStart = firstMiddle.offsetLeft;
  pageState.setWidth = firstNext.offsetLeft - firstMiddle.offsetLeft;
  return pageState.setWidth > 0;
}

function recenterIfNeeded() {
  if (!pageState.setWidth && !updateLoopMetrics()) return;
  // Recenter only when we actually cross into side clone sets.
  // Earlier thresholds (like 75% width) can cause visible jumps mid-scroll.
  const leftEdge = pageState.setStart;
  const rightEdge = pageState.setStart + pageState.setWidth;
  let next = pageEls.gallery.scrollLeft;
  if (next < leftEdge) next += pageState.setWidth;
  else if (next >= rightEdge) next -= pageState.setWidth;
  if (next !== pageEls.gallery.scrollLeft) {
    pageEls.gallery.scrollLeft = next;
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

function mediaRectVisibleInScrollerArea(rect, scrollerRect) {
  const x1 = Math.max(rect.left, scrollerRect.left, 0);
  const x2 = Math.min(rect.right, scrollerRect.right, window.innerWidth);
  const y1 = Math.max(rect.top, scrollerRect.top, 0);
  const y2 = Math.min(rect.bottom, scrollerRect.bottom, window.innerHeight);
  return Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
}

const FOCUS_MIN_SLIDE_AREA = 32;

function refreshProjectMaxScaleCache() {
  const g = pageEls.gallery;
  if (!g) {
    pageState.cachedMaxScale = 1.06;
    return;
  }
  const raw = getComputedStyle(g).getPropertyValue("--project-slide-active-scale").trim();
  const n = parseFloat(raw);
  pageState.cachedMaxScale = Number.isFinite(n) && n > 1 ? n : 1.06;
}

/** 0..1 from 0..1 for a softer shoulder at the “edge” of the lerp. */
function smoothStep01(t) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/**
 * Glide each slide's --project-scroll-scale from its current value toward __targetScale.
 * Runs on its own rAF loop so the visual scale animation is independent of wheel/scroll event
 * timing — uneven scroll input still yields a smooth scale-up when arriving at a project.
 */
function tickScaleAnim() {
  pageState.scaleAnimRaf = null;
  const scroller = pageEls.gallery;
  if (!scroller) return;
  const slides = scroller.querySelectorAll(".project-slide");
  let needsMore = false;
  for (const slide of slides) {
    if (!(slide instanceof HTMLElement)) continue;
    const target = slide.__targetScale != null ? slide.__targetScale : 1;
    const current = slide.__currentScale != null ? slide.__currentScale : 1;
    let next;
    if (Math.abs(target - current) <= SCALE_EPS) {
      if (current === target) continue;
      next = target;
      slide.__currentScale = target;
    } else {
      next = current + (target - current) * SCALE_LERP;
      slide.__currentScale = next;
      needsMore = true;
    }
    const valStr = next.toFixed(3);
    if (slide.dataset.scrollScale !== valStr) {
      slide.style.setProperty("--project-scroll-scale", valStr);
      slide.dataset.scrollScale = valStr;
    }
  }
  if (needsMore) {
    pageState.scaleAnimRaf = requestAnimationFrame(tickScaleAnim);
  }
}

function ensureScaleAnimRunning() {
  if (pageState.scaleAnimRaf == null) {
    pageState.scaleAnimRaf = requestAnimationFrame(tickScaleAnim);
  }
}

/**
 * Single-pass scroll sync.
 *
 * Read each slide's rect once and compute its target scale + front-z candidate. Writing scale
 * targets here (instead of the live CSS variable) lets tickScaleAnim() lerp the actual value on
 * a separate rAF loop, which keeps the scale-up animation smooth even with uneven wheel input.
 *
 * Video / meta slides intentionally stay at scale 1 — videos because re-rasterising frames each
 * scroll tick is the main source of jitter, meta because its long copy block reflows when scaled.
 *
 * No automatic playback: videos are only ever started by the user clicking the native controls,
 * so we don't pick a "focused" media or call play()/pause() during scroll. This is the cleanest
 * way to keep scroll perfectly smooth on lower-end machines.
 */
function syncProjectGalleryScrollState() {
  const scroller = pageEls.gallery;
  if (!scroller) return;

  if (!pageState.hasUserInteracted) {
    const slides = scroller.querySelectorAll(".project-slide");
    for (const slide of slides) {
      if (!(slide instanceof HTMLElement)) continue;
      slide.__targetScale = 1;
      slide.__currentScale = 1;
      if (slide.dataset.scrollScale !== "1.000") {
        slide.style.setProperty("--project-scroll-scale", "1");
        slide.dataset.scrollScale = "1.000";
      }
      if (slide.dataset.scrollFront === "1") {
        slide.style.removeProperty("z-index");
        slide.dataset.scrollFront = "";
      }
    }
    return;
  }

  const scrollerRect = scroller.getBoundingClientRect();
  if (scrollerRect.width < 2) return;

  const rootCx = (scrollerRect.left + scrollerRect.right) / 2;
  const maxExtra = pageState.cachedMaxScale - 1;
  const slides = scroller.querySelectorAll(".project-slide");

  const candidates = [];
  let frontSlide = null;
  let frontT = -1;

  for (const slide of slides) {
    if (!(slide instanceof HTMLElement)) continue;
    if (slide.classList.contains("project-empty")) continue;
    const rect = slide.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) {
      // Off-screen / unmeasured: snap target+current to 1 so when it scrolls back into view the
      // glide starts from rest instead of jumping mid-animation.
      slide.__targetScale = 1;
      slide.__currentScale = 1;
      if (slide.dataset.scrollScale !== "") {
        slide.style.removeProperty("--project-scroll-scale");
        slide.style.removeProperty("z-index");
        slide.dataset.scrollScale = "";
      }
      continue;
    }

    const area = mediaRectVisibleInScrollerArea(rect, scrollerRect);
    const isVideoSlide = slide.classList.contains("project-slide--has-video");
    const isMetaSlide = slide.classList.contains("project-slide--meta");
    const skipScale = isVideoSlide || isMetaSlide;
    let scale = 1;
    let t = 0;

    if (area >= FOCUS_MIN_SLIDE_AREA && !skipScale) {
      const slideCx = (rect.left + rect.right) / 2;
      const dist = Math.abs(slideCx - rootCx);
      const falloff = scrollerRect.width * 0.45 + rect.width * 0.2;
      const raw = 1 - Math.min(1, dist / Math.max(1, falloff));
      t = smoothStep01(raw);
      scale = 1 + maxExtra * t;

      if (t > frontT) {
        frontT = t;
        frontSlide = slide;
      }
    }

    candidates.push({ slide, scale, t });
  }

  // Write phase: only update the *target* scale here. The actual CSS variable is animated
  // toward this target by tickScaleAnim() on a separate rAF loop, which gives a smooth glide
  // that is decoupled from uneven wheel/scroll event timing.
  let needAnim = false;
  for (const c of candidates) {
    c.slide.__targetScale = c.scale;
    if (c.slide.__currentScale == null) c.slide.__currentScale = 1;
    if (Math.abs(c.slide.__currentScale - c.scale) > SCALE_EPS) needAnim = true;

    if (c.slide === frontSlide && frontT > 0.02) {
      if (c.slide.dataset.scrollFront !== "1") {
        c.slide.style.setProperty("z-index", "2");
        c.slide.dataset.scrollFront = "1";
      }
    } else if (c.slide.dataset.scrollFront === "1") {
      c.slide.style.removeProperty("z-index");
      c.slide.dataset.scrollFront = "";
    }
  }
  if (needAnim) ensureScaleAnimRunning();
}

/** Wire the per-frame scale sync to scroll/resize. (Name kept for backward compatibility with
 *  the renderSequence/renderNotFound teardown hooks; there's no longer any video pause logic.) */
function wireProjectVideoPause() {
  if (pageState.projectVideoUnwire) {
    pageState.projectVideoUnwire();
    pageState.projectVideoUnwire = null;
  }
  const root = pageEls.gallery;
  if (!root) return;

  refreshProjectMaxScaleCache();

  let raf = null;
  const schedule = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      syncProjectGalleryScrollState();
    });
  };
  const onScroll = () => schedule();
  const onResize = () => {
    refreshProjectMaxScaleCache();
    schedule();
  };

  root.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });

  pageState.projectVideoUnwire = () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
    root.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
  };

  schedule();
  requestAnimationFrame(() => requestAnimationFrame(schedule));
}

function runMomentum() {
  if (Math.abs(pageState.velocity) <= SCROLL_PHYSICS.MIN_VELOCITY) {
    pageState.velocity = 0;
    if (pageState.momentumRaf) {
      cancelAnimationFrame(pageState.momentumRaf);
      pageState.momentumRaf = null;
    }
    syncProjectGalleryScrollState();
    return;
  }

  pageState.velocity *= SCROLL_PHYSICS.MOMENTUM_DECAY;
  pageEls.gallery.scrollLeft += pageState.velocity * SCROLL_PHYSICS.VELOCITY_TO_PIXEL;
  recenterIfNeeded();
  // The scroll-position change above triggers the gallery's scroll listener which already
  // schedules syncProjectGalleryScrollState via rAF; calling it here too would do the same
  // expensive layout work twice per frame.
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
  pageEls.gallery.addEventListener("pointerdown", () => {
    pageState.hasUserInteracted = true;
  });
  pageEls.gallery.addEventListener(
    "wheel",
    (event) => {
      pageState.hasUserInteracted = true;
      event.preventDefault();
      queueMomentumFromWheel(event);
    },
    { passive: false },
  );

  pageEls.gallery.addEventListener("scroll", recenterIfNeeded, { passive: true });
}

function renderNotFound() {
  if (pageState.projectVideoUnwire) {
    pageState.projectVideoUnwire();
    pageState.projectVideoUnwire = null;
  }
  if (pageState.scaleAnimRaf != null) {
    cancelAnimationFrame(pageState.scaleAnimRaf);
    pageState.scaleAnimRaf = null;
  }
  pageEls.gallery.classList.remove("is-initializing");
  pageEls.gallery.innerHTML = `<article class="project-empty">${pageI18n[pageState.language].notFound}</article>`;
  updateCounter(0);
}

function renderSequence() {
  if (pageState.projectVideoUnwire) {
    pageState.projectVideoUnwire();
    pageState.projectVideoUnwire = null;
  }
  if (pageState.scaleAnimRaf != null) {
    cancelAnimationFrame(pageState.scaleAnimRaf);
    pageState.scaleAnimRaf = null;
  }
  pageEls.gallery.classList.add("is-initializing");
  pageEls.gallery.innerHTML = "";
  [-1, 0, 1].forEach((cloneSet) => {
    pageState.sequence.forEach((slide, realIndex) => {
      const node = createSlide(slide, realIndex, cloneSet);
      pageEls.gallery.appendChild(node);
    });
  });
  wireLandscapeMediaSizing();
  wireProjectPortraitVideoAspect();

  requestAnimationFrame(() => {
    const middleSlides = Array.from(pageEls.gallery.querySelectorAll('.project-slide[data-clone-set="0"]'));
    if (!middleSlides.length) return;
    pageState.hasUserInteracted = false;
    updateLoopMetrics();
    // Open on intro frame: metadata + first image visible
    pageEls.gallery.scrollLeft = pageState.setStart;
    updateCounter(0);
    wireCounterObserver();
    wireProjectVideoPause();
    requestAnimationFrame(() => {
      pageEls.gallery.classList.remove("is-initializing");
    });
  });
}

function updateOutboundNavLinks() {
  if (!window.VANLAB_THEME) return;
  const project = pageState.projects.find((item) => item.slug === pageState.currentSlug);
  if (!project) return;
  const backPage = pageState.returnView === "index" ? "./projects.html" : "./index.html";
  const backUrl = new URL(backPage, window.location.href);
  backUrl.searchParams.set("lang", pageState.language);
  backUrl.searchParams.set("theme", getCurrentTheme());
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
  const primaryCover = project.coverPath;
  const orderedImages = [primaryCover, ...details.filter((path) => path !== project.coverPath && path !== primaryCover)];
  warmupProjectMediaPaths(orderedImages.slice(0, 3), { eager: true, maxItems: 3 });
  warmupProjectMediaPaths(orderedImages, { eager: false, maxItems: 8 });
  const localizedDescriptions = Array.isArray(project.detailDescriptions?.[pageState.language])
    ? project.detailDescriptions[pageState.language]
    : Array.isArray(project.detailDescriptions?.en)
      ? project.detailDescriptions.en
      : [];
  pageState.imageCount = orderedImages.length;

  pageState.sequence = [
    { type: "meta", html: buildMetaMarkup(project), counterIndex: -1 },
    ...orderedImages.map((path, index) => {
      const ytPosterRaw = String(project.youtubePosterPath || "").trim();
      const youtubePosterPath =
        isYouTubePath(path) && ytPosterRaw && !isYouTubePath(ytPosterRaw) ? ytPosterRaw : "";
      return {
        type: "image",
        path,
        displayMode: getProjectDetailDisplayMode(project, path, index),
        alt:
          String(localizedDescriptions[index] || "").trim() ||
          `${project.name} ${index === 0 ? "cover" : `detail ${index}`}`,
        caption: String(localizedDescriptions[index] || "").trim(),
        counterIndex: index,
        youtubePosterPath,
      };
    }),
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
    url.searchParams.set("theme", getCurrentTheme());
    window.history.replaceState(window.history.state, "", url.toString());
    renderPage();
  }
  pageEls.langToggleBtn?.addEventListener("click", () => {
    const nextLanguage = pageState.language === "vi" ? "en" : "vi";
    switchLanguage(nextLanguage);
  });
  pageEls.themeToggleBtn?.addEventListener("click", () => {
    window.VANLAB_THEME?.toggle({ syncUrl: true });
  });
  window.addEventListener("vanlab-themechange", () => {
    updateThemeToggleUi();
    updateOutboundNavLinks();
    window.VANLAB_REFRESH_FOOTER_BAR?.();
  });
  window.addEventListener("resize", () => {
    updateLoopMetrics();
    recenterIfNeeded();
  });
  // Re-measure after late media decode to avoid stale loop width.
  pageEls.gallery.addEventListener(
    "load",
    (event) => {
      if (event?.target instanceof HTMLImageElement) {
        applyLandscapeClassForImage(event.target);
      }
      if (!updateLoopMetrics()) return;
      // Keep opening frame anchored while media is still resolving layout.
      if (!pageState.hasUserInteracted) {
        pageEls.gallery.scrollLeft = pageState.setStart;
      }
    },
    true,
  );
  wireHorizontalWheel();
  renderPage();
}

initializePage();

