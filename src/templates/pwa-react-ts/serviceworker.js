const cacheName = 'assets'
const cachedAssets = ['/', 'index.html', 'app.js', 'main.scss', 'style.css']

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(cachedAssets)
    }),
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        caches.open(cacheName).then(cache => {
          cache.put(event.request, networkResponse.clone())
          return networkResponse
        })
      })

      return cachedResponse || fetchPromise
    }),
  )
})
