// =====================================================
// FloraQuiz Service Worker
// v2.1
// =====================================================

const STATIC_CACHE = "floraquiz-static-v2";

const IMAGE_CACHE = "floraquiz-images-v1";

const MAX_IMAGE_CACHE_ITEMS = 300;

const STATIC_FILES = [

    "./",
    "./index.html",
    "./quiz.html",
    "./css/style.css",
    "./js/app.js",
    "./js/quiz.js",
    "./js/storage.js",
    "./data/plants.json",
    "./images/no-image.png",
    "./manifest.json"
];

// -----------------------------------------------------
// Install
// -----------------------------------------------------

self.addEventListener("install", event => {

    event.waitUntil(

		caches.open(STATIC_CACHE)

            .then(cache => cache.addAll(STATIC_FILES))
    );
	self.skipWaiting();
});

// -----------------------------------------------------
// Activate
// -----------------------------------------------------

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys =>

            Promise.all(

                keys.map(key => {

                    if (

                        key !== STATIC_CACHE &&

                        key !== IMAGE_CACHE

                    ) {

                        return caches.delete(key);

                    }

                })

            )

        )

    );

    self.clients.claim();

});

// -----------------------------------------------------
// Fetch
// -----------------------------------------------------

async function trimImageCache() {

    const cache = await caches.open(IMAGE_CACHE);

    const keys = await cache.keys();

    if (keys.length <= MAX_IMAGE_CACHE_ITEMS) {

        return;

    }

    const removeCount =
        keys.length - MAX_IMAGE_CACHE_ITEMS;

    for (let i = 0; i < removeCount; i++) {

        await cache.delete(keys[i]);

    }

}

async function cacheFirst(request) {

    const cache = await caches.open(IMAGE_CACHE);

    const cached = await cache.match(request);

    if (cached) {

        return cached;

    }

    try {

        const response = await fetch(request);

        if (response.ok) {

            await cache.put(

                request,

                response.clone()

            );

            await trimImageCache();

        }

        return response;

    }

    catch {

        const fallback =
            await cache.match("./images/no-image.png");

        if (fallback) {

            return fallback;

        }

        throw new Error("Image not available.");

    }

}

self.addEventListener("fetch", event => {

    const url = new URL(event.request.url);

    // -------------------------------------------------
    // Képek
    // -------------------------------------------------

    if (

        url.pathname.includes("/images/")

    ) {

        event.respondWith(

            cacheFirst(event.request)

        );

        return;

    }

    // -------------------------------------------------
    // Statikus fájlok
    // -------------------------------------------------

    event.respondWith(

        caches.match(event.request)

            .then(cached => {

                if (cached) {

                    return cached;

                }

                return fetch(event.request);

            })

    );

});