const CACHE_NAME = "game-app-cache-v1"
const urlsToCache = ["/", "/manifest.json", "/game-console.png", "/rubik.png"]

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache)
        }),
    )
})

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName)
                    }
                }),
            )
        }),
    )
})

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches
            .match(event.request)
            .then((response) => {
                if (response) {
                    return response
                }

                return fetch(event.request).then((response) => {
                    if (!response || response.status !== 200 || response.type !== "basic") {
                        return response
                    }

                    const responseToCache = response.clone()

                    caches.open(CACHE_NAME).then((cache) => {
                        if (!event.request.url.includes("/api-game.bloque.app/")) {
                            cache.put(event.request, responseToCache)
                        }
                    })

                    return response
                })
            })
            .catch(() => {
                if (event.request.url.includes("leaderboard")) {
                    return new Response(JSON.stringify({ players: [] }), {
                        headers: { "Content-Type": "application/json" },
                    })
                }
                if (event.request.url.includes("market")) {
                    return new Response(JSON.stringify({ items: [] }), {
                        headers: { "Content-Type": "application/json" },
                    })
                }
            }),
    )
})
