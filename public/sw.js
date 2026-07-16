// Minimal offline-support service worker for the Umi AI Studio PWA.
// Caches the app shell on install and serves cached responses when the
// network is unavailable, falling back to a network-first strategy so
// content stays fresh whenever a connection is available.

const CACHE_NAME = "umi-ai-studio-v1";
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests; let everything else (POST to API routes, etc.)
  // pass straight through to the network.
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // Only cache same-origin, successful responses.
          if (request.url.startsWith(self.location.origin) && response.ok) {
            cache.put(request, responseClone);
          }
        });
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
  );
});
