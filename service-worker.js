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

// self.addEventListener('activate', ev=> {
//     ev.waitUntil(
//         // Create the database. If the promise resolves, add the database to
//         // the service worker by making it a property of self.
//         createDB().then ( db => {
//             console.log('Got the db!');
//             self.db = db;
//         })
//     );
//     return self.clients.claim();
// });

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

// function createDB() {
//     indexedDB.open("pois", 1)
//     return new Promise ( (resolve, reject) => {
//         if(reject) {
//             console.log(e.target.errorCode)
//             reject(e.target.errorCode);
//         } else {
//             resolve(db = e.target.result);
//             console.log(db.version)
//             if(db.version >= 2) {
//                 db.deleteObjectStore('poi');
//             }
        
//             const objectStore = db.createObjectStore("poi", {
//                     keyPath:"name"
//             });

//             for(let i=0; i<poi.length; i++) {
//                 objectStore.add(poi[i]);
//             }
//         }
//     });
// }

// function searchDB(key) {
//     const name = document.getElementById('username').value;
//     const transaction = db.transaction(key);
//     const objectStore = transaction.objectStore(key);
//     const request = objectStore.get(name);

//     request.onsuccess =  e => {
//         if(e.target.result) {
//             document.getElementById('username2').value  = e.target.result.username; 
//             document.getElementById('name').value = e.target.result.name;
//             document.getElementById('course').value = e.target.result.course;
//         } else {
//             displayMessage('No results!');
//         } 
// }