export const THEME_STORAGE_KEY = "folio-theme";

export type Theme = "light" | "dark" | "system";

export function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

export const THEME_BOOTSTRAP = `(function(){
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var theme = stored === "light" || stored === "dark" ? stored : "system";
    var dark = theme === "dark" || (theme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    var root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
  } catch (e) {}
})();`;
