const CACHE_NAME = 'orbis-v2.0.0'
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/marketplace',
  '/messages',
  '/manifest.json',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached
      return fetch(event.request).then(response => {
        if (response.status === 200) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        }
        return response
      }).catch(() => caches.match('/'))
    })
  )
})

self.addEventListener('push', event => {
  const data = event.data?.json() || {}
  event.waitUntil(
    self.registration.showNotification(data.title || 'ORBIS', {
      body: data.body || 'Nouvelle notification ORBIS',
      icon: '/icon.svg',
      badge: '/icon.svg',
      data: data,
    })
  )
})
