const CACHE_NAME = 'apfinanceiro-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/', '/manifest.json']);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Stale-while-revalidate strategy for UI and caching
  if (event.request.method === 'GET' && event.request.url.startsWith('http')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(() => {
            // Caso offline continue com o cache
            return cachedResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});
