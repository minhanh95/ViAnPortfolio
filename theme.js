(function initVanlabTheme() {
  const STORAGE_KEY = "vanlab-theme";
  const DEFAULT_THEME = "light";
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
