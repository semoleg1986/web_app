const reloadStorageKey = "curs:chunk-reload-at";
const reloadCooldownMs = 30_000;

const chunkErrorPatterns = [
  "Importing a module script failed",
  "Failed to fetch dynamically imported module",
  "error loading dynamically imported module",
  "Loading chunk",
  "ChunkLoadError",
  "Load failed"
];

function isChunkLoadError(value: unknown): boolean {
  const message = value instanceof Error ? value.message : String(value ?? "");
  return chunkErrorPatterns.some((pattern) => message.includes(pattern));
}

function reloadOnce(): void {
  const now = Date.now();
  const previous = Number(window.sessionStorage.getItem(reloadStorageKey) ?? "0");

  if (Number.isFinite(previous) && now - previous < reloadCooldownMs) {
    return;
  }

  window.sessionStorage.setItem(reloadStorageKey, String(now));
  window.location.reload();
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:chunkError", () => {
    reloadOnce();
  });

  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();
    reloadOnce();
  });

  window.addEventListener("unhandledrejection", (event) => {
    if (isChunkLoadError(event.reason)) {
      event.preventDefault();
      reloadOnce();
    }
  });

  window.addEventListener(
    "error",
    (event) => {
      const target = event.target;
      const isScriptError = target instanceof HTMLScriptElement && target.type === "module";

      if (isScriptError || isChunkLoadError(event.error) || isChunkLoadError(event.message)) {
        event.preventDefault();
        reloadOnce();
      }
    },
    true
  );
});
