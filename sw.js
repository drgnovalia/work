const CACHE_NAME = 'app-nova-v1';
const assets = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/apps.json',
  '/manifest.json'
];

// Tahap Install: Simpan semua aset utama ke memori cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Tahap Fetch: Ambil data dari cache jika sedang offline
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request);
    })
  );
});
