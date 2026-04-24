(function initVanlabTheme() {
  const STORAGE_KEY = "vanlab-theme";
  const DEFAULT_THEME = "dark";
  const META_LIGHT = "#FFFCF5";
  const META_DARK = "#050505";

  function updateMeta(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "light" ? META_LIGHT : META_DARK);
    }
  }

  function emit(theme) {
    window.dispatchEvent(new CustomEvent("vanlab-themechange", { detail: { theme } }));
  }

  const api = {
    STORAGE_KEY,
    DEFAULT_THEME,
    get() {
      return document.documentElement.dataset.theme === "light" ? "light" : "dark";
    },
    commit(theme, options = {}) {
      if (theme !== "light" && theme !== "dark") return;
      const { syncUrl = false } = options;
      document.documentElement.dataset.theme = theme;
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {
        /* ignore private mode / blocked storage */
      }
      updateMeta(theme);
      if (syncUrl) {
        try {
          const url = new URL(window.location.href);
          url.searchParams.set("theme", theme);
          window.history.replaceState(window.history.state, "", url.toString());
        } catch (e) {
          /* ignore */
        }
      }
      emit(theme);
    },
    toggle(options) {
      const next = api.get() === "dark" ? "light" : "dark";
      api.commit(next, options);
      return next;
    },
  };

  window.VANLAB_THEME = api;

  const params = new URLSearchParams(window.location.search);
  const queryTheme = params.get("theme");
  const fromQuery = queryTheme === "light" || queryTheme === "dark" ? queryTheme : null;
  let fromStorage = null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") fromStorage = stored;
  } catch (e) {
    /* ignore */
  }
  const initial = fromQuery || fromStorage || DEFAULT_THEME;
  document.documentElement.dataset.theme = initial;
  try {
    localStorage.setItem(STORAGE_KEY, initial);
  } catch (e) {
    /* ignore */
  }
  updateMeta(initial);

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    if (event.newValue !== "light" && event.newValue !== "dark") return;
    document.documentElement.dataset.theme = event.newValue;
    updateMeta(event.newValue);
    emit(event.newValue);
  });
})();

function initSiteFooterYear() {
  const el = document.getElementById("siteFooterYear");
  if (!el) return;
  const y = String(new Date().getFullYear());
  el.textContent = y;
  if (el.tagName === "TIME") el.setAttribute("datetime", y);
}

const FOOTER_BAR_I18N = {
  vi: {
    email: "EMAIL",
    phone: "ĐIỆN THOẠI",
    linkedin: "LINKEDIN",
    instagram: "INSTAGRAM",
    scrollTop: "Về đầu trang",
  },
  en: {
    email: "EMAIL",
    phone: "PHONE",
    linkedin: "LINKEDIN",
    instagram: "INSTAGRAM",
    scrollTop: "Back to top",
  },
};

function getFooterBarLang() {
  try {
    const stored = localStorage.getItem("vanlab-language");
    if (stored === "vi" || stored === "en") return stored;
  } catch (e) {
    /* ignore */
  }
  const q = new URLSearchParams(window.location.search).get("lang");
  if (q === "vi" || q === "en") return q;
  return document.documentElement.lang === "vi" ? "vi" : "en";
}

function refreshFooterContactBar() {
  const dict = FOOTER_BAR_I18N[getFooterBarLang()] || FOOTER_BAR_I18N.en;
  const setLabel = (sel, text) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = text;
  };
  setLabel("[data-footer-i18n='email']", dict.email);
  setLabel("[data-footer-i18n='phone']", dict.phone);
  setLabel("[data-footer-i18n='linkedin']", dict.linkedin);
  setLabel("[data-footer-i18n='instagram']", dict.instagram);
  const btn = document.getElementById("footerScrollTopBtn");
  if (btn) {
    btn.setAttribute("aria-label", dict.scrollTop);
    btn.title = dict.scrollTop;
  }
}

window.VANLAB_REFRESH_FOOTER_BAR = refreshFooterContactBar;

function initFooterContactBar() {
  refreshFooterContactBar();
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("#footerScrollTopBtn");
    if (!btn) return;
    const L = window.__vanlabLenis;
    if (L && typeof L.scrollTo === "function") {
      L.scrollTo(0, { duration: 1.05 });
    } else {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        window.scrollTo(0, 0);
      }
    }
  });
}

function vanlabInitFooterHelpers() {
  initSiteFooterYear();
  initFooterContactBar();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", vanlabInitFooterHelpers);
} else {
  vanlabInitFooterHelpers();
}
