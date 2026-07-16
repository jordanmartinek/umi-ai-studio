"use client";

import { useEffect } from "react";

/**
 * Registers the PWA service worker on the client so the app becomes
 * installable (Add to Home Screen) and can serve cached content when
 * offline. Registration is skipped in unsupported browsers automatically.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration failures (e.g. unsupported environment, dev-mode
        // quirks) are non-fatal — the app still works as a regular site.
      });
    });
  }, []);

  return null;
}
