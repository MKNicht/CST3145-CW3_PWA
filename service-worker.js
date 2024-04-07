var cacheName = "Lessons-v1";
var cacheFiles = [
    "/",
    "/index.html",
    "/image/art.png",
    "/image/biology.png",
    "/image/chemistry.png",
    "/image/chinese.png",
    "/image/computer science.png",
    "/image/english.png",
    "/image/geography.png",
    "/image/icon-128x128.png",
    "/image/icon-192x192.png",
    "/image/icon-512x512.png",
    "/image/math.png",
    "/image/music.png",
    "/image/physics.png",
    "/lessons.webmanifest",
    "/assets/index-legacy.68216524.js",
    "/assets/index.489fda98.css",
    "/assets/index.968eabe3.js",
    "/assets/polyfills-legacy.1feeef63.js",
];

self.addEventListener("install", function (e) {
    console.log("[Service Worker] Install");
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log("[Service Worker] Caching files");
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // 返回緩存中的匹配文件，或者如果沒有匹配，則發起一個網絡請求
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (cachedFile) {
            if (cacheFiles) {
                console.log("[Service Worker] Resource fetched from the cache for: " + e.request.url);
                return cachedFile;
            } else {
                return fetch(e.request).then(function (response) {
                    return caches.open(cacheName).then(function (cache){
                        cache.put(e.request, response.clone());
                        console.log("[Service Worker] Resource fetched and saved in the cache for: " + e.request.url);
                        return response;
                    });
                });
            }
        })
    );
});

