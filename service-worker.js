self.addEventListener("install", () => {
  // Le SW s'installe immédiatement
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  // Le SW prend le contrôle des pages ouvertes
  clients.claim();
});
