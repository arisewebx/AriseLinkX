// Basic Service Worker config
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Installed automatically by PWA init');
});

self.addEventListener('fetch', (e) => {
  // Let browser handle fetches natively
});
