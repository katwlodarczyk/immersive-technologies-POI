const CACHE_NAME = 'cache';
const urlsToCache = [
    // 'index.html',
    // 'js/bundle.js',
    // 'css/webapp.css'
];

self.addEventListener('install', ev=> {

    console.log('Installed the service worker...');
    ev.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache=> {
                console.log(`Opened cache ${cache}`);
                // return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', ev=> {
    console.log('Claiming control...');
    return self.clients.claim();
});

self.addEventListener('fetch', ev=> {
    console.log(`Service worker intercepted: ${ev.request.url}`);
    const url = new URL(ev.request.url);

    ev.respondWith(
        caches.match(ev.request).then(res=> {
            if(res) {
                return res;
            }

            if(ev.request.url.indexOf("/webapp/map") != -1 || ev.request.url.indexOf("/webapp/dem") != -1) {
                return fetch(ev.request)
                    .then(res2 => {
                        console.log("Caching as matches pattern");
                        return caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(ev.request, res2.clone());
                                return res2;
                            });
                    });
            } else {
                return fetch(ev.request);
            }
        })
    )
});