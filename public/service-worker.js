//installation
//waiting - waits until any existing service worker is closed
//activation

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

self.addEventListener("install", function(evt){
    evt.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => cache.addAll(FILE_TO_CACHE))
    );
    self.skipWaiting();
});

self.addEventListener("activate", function(evt){
    evt.waitUntil(
        cache.keys().then(keyList)
    )
})