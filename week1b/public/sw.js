let cache = null;
let dataCacheName ='birdData-v1';
let cacheName = 'birdPWA-step-8-1';
let filesToCache = [
    '/javascripts/app.js',
    '/javascripts/birdInformation.js',
    '/javascripts/chat.js',
    '/javascripts/database.js',
    '/javascripts/details.js',
    '/javascripts/gmaps.js',
    '/javascripts/index.js',
    '/javascripts/searchByAddress.js',
    '/javascripts/upload.js',
    '/javascripts/idb/index.js',
    '/stylesheets/geocodeMap.css',
    '/stylesheets/gmaps.css',
    '/stylesheets/showAll.css',
    '/stylesheets/submitBird.css',
    '/bird',
    '/'
]


/**
 * installation event: it adds all the files to be cached
 */
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cacheX) {
            console.log('[ServiceWorker] Caching app shell');
            cache= cacheX;
            return cache.addAll(filesToCache);
        })
    );
});

/**
 * activation of service worker: it removes all cashed files if necessary
 */
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );

    return self.clients.claim();
});


/**
 * this is called every time a file is fetched. This is a middleware, i.e. this method is
 * called every time a page is fetched by the browser
 * there are two main branches:
 * /weather_data posts cities names to get data about the weather from the server. if offline, the fetch will fail and the
 *      control will be sent back to Ajax with an error - you will have to recover the situation
 *      from there (e.g. showing the cached data)
 * all the other pages are searched for in the cache. If not found, they are returned
 */
self.addEventListener('fetch', (event) => {
    console.log('Fetch intercepted for:', event.request.url);
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        }),
    );
});
