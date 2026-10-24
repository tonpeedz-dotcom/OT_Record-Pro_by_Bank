const CACHE_NAME = 'ot-promax-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './tutorial-ot.js',
  './icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // บังคับให้ SW ตัวใหม่ทำงานทันที
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // ลบ Cache เก่าทิ้งเมื่อมีการอัปเดต
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Network First: ดึงจากเน็ตก่อนเพื่ออัปเดตข้อมูลล่าสุด
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to Cache: ถ้าออฟไลน์ให้ดึงจาก Cache
        return caches.match(event.request);
      })
  );
});