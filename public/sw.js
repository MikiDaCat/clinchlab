/* ════════════════════════════════════════════════════════════
   TMT · Service Worker
   Stratégie : Cache-first pour assets statiques,
               Network-first pour pages et API.
   Permet l'installation PWA sur Android et iOS.
════════════════════════════════════════════════════════════ */

const CACHE_NAME  = "tmt-v1"
const STATIC_URLS = [
  "/",
  "/setup",
  "/timer",
  "/library",
  "/history",
  "/coach",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
]

/* ── Install : pré-cache les pages principales */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_URLS).catch(() => {
        /* Ignore erreurs sur les icônes manquantes */
      })
    ).then(() => self.skipWaiting())
  )
})

/* ── Activate : nettoyer les anciens caches */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  )
})

/* ── Fetch : Network-first avec fallback cache */
self.addEventListener("fetch", (event) => {
  /* Ignorer les requêtes non-GET et les API externes */
  if (event.request.method !== "GET") return
  if (event.request.url.includes("/api/")) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        /* Mettre en cache si réponse valide */
        if (response.ok && response.type !== "opaque") {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone))
        }
        return response
      })
      .catch(() =>
        /* Fallback cache si réseau indisponible */
        caches.match(event.request).then((cached) => {
          if (cached) return cached
          /* Page hors-ligne générique */
          return new Response(
            `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>TMT · Hors ligne</title>
  <style>
    body { background: #050508; color: #f2ede3; font-family: system-ui; display: flex; align-items: center; justify-content: center; min-height: 100dvh; text-align: center; margin: 0; flex-direction: column; gap: 16px; }
    h1 { font-size: 24px; font-weight: 700; }
    p { color: #6f6655; font-size: 14px; }
  </style>
</head>
<body>
  <h1>TMT · Hors ligne</h1>
  <p>Reconnectez-vous pour accéder à l'app.</p>
</body>
</html>`,
            { headers: { "Content-Type": "text/html; charset=utf-8" } }
          )
        })
      )
  )
})
