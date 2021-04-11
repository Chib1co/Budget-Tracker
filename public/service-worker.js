//installation
//waiting - waits until any existing service worker is closed
//activation

console.log('This is your service-worker.js file!');

const FILE_TO_CACHE = [
    "/",
    "index.html",
    "manifest.webmanifest",
    "index.js",
    "styles.css",
    "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/4.3.1/materia/bootstrap.css",
    "https://use.fontawesome.com/releases/v5.8.2/css/all.css",
    "icons/icon-192x192.png",
    "icons/icon-512x512.png"
];

const STATIC_CACHE = "static-cache-v1";
const RUNTIME_CACHE = "runtime-cache";

//install
self.addEventListener("install", function (evt) {
    evt.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => cache.addAll(FILE_TO_CACHE))
    );
    self.skipWaiting();
});

//activate
self.addEventListener("activate", function (evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== STATIC_CACHE && key !== RUNTIME_CACHE) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key)
                    }
                })
            )
        })
    );
    self.clients.claim();
});

//fetch
self.addEventListener("fetch", function(evt) {
    if(evt.request.url.includes("/api/" && evt.request.method === "GET")) {
        evt.respondWith(
            caches.open(STATIC_CACHE).then(cache => {
                return fetch(evt.request)
                .then(response => {
                if(response.status === 200) {
                    cache.put(evt.request.url, response.clone());
                }
                return response;
            });
            }).catch(err => console.log(err))
        );
        return;
    }

    evt.respondWith(
        caches.match(evt.request).then(response => {
                return response || fetch(evt.request);
        })
    );
});
