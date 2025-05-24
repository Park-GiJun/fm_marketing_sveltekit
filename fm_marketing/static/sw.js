// ServiceWorker for FM Marketing
const CACHE_NAME = 'fm-marketing-v1';
const urlsToCache = [
  '/',
  '/static/favicon.png',
  // 기본 리소스들만 캐시
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        // 실패하는 리소스가 있어도 무시하고 계속 진행
        return Promise.allSettled(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.warn('Failed to cache:', url, err);
              return null;
            });
          })
        );
      })
  );
});

self.addEventListener('fetch', function(event) {
  // 개발 중에는 캐시 사용하지 않음
  if (event.request.url.includes('localhost')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
