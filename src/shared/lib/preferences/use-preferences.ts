import { translate } from "~/shared/lib/preferences/messages";
import type { LocaleCode, ThemeMode, ThemeResolved } from "~/shared/lib/preferences/types";

const LOCALE_STORAGE_KEY = "curs.locale";
const THEME_STORAGE_KEY = "curs.theme";

let mediaListenerBound = false;

function getSystemTheme(): ThemeResolved {
  if (!process.client) {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(mode: ThemeMode): ThemeResolved {
  return mode === "system" ? getSystemTheme() : mode;
}

function applyThemeToDocument(theme: ThemeResolved): void {
  if (!process.client) {
    return;
  }
  document.documentElement.setAttribute("data-theme", theme);
}

export function usePreferences() {
  const locale = useState<LocaleCode>("pref-locale", () => "ru");
  const themeMode = useState<ThemeMode>("pref-theme-mode", () => "system");
  const resolvedTheme = useState<ThemeResolved>("pref-theme-resolved", () => "light");

  function updateResolvedTheme(): void {
    const nextTheme = resolveTheme(themeMode.value);
    resolvedTheme.value = nextTheme;
    applyThemeToDocument(nextTheme);
  }

  function setLocale(nextLocale: LocaleCode): void {
    locale.value = nextLocale;
    if (process.client) {
      localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    }
  }

  function setThemeMode(nextThemeMode: ThemeMode): void {
    themeMode.value = nextThemeMode;
    if (process.client) {
      localStorage.setItem(THEME_STORAGE_KEY, nextThemeMode);
    }
    updateResolvedTheme();
  }

  function t(key: string): string {
    return translate(locale.value, key);
  }

  function init(): void {
    if (!process.client) {
      return;
    }

    const localeRaw = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (localeRaw === "ru" || localeRaw === "en") {
      locale.value = localeRaw;
    }

    const themeRaw = localStorage.getItem(THEME_STORAGE_KEY);
    if (themeRaw === "system" || themeRaw === "light" || themeRaw === "dark") {
      themeMode.value = themeRaw;
    }

    updateResolvedTheme();

    if (!mediaListenerBound) {
      mediaListenerBound = true;
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (themeMode.value === "system") {
          updateResolvedTheme();
        }
      });
    }
  }

  return {
    locale,
    themeMode,
    resolvedTheme,
    init,
    setLocale,
    setThemeMode,
    t
  };
}
