// =====================================================
// FloraQuiz Service Worker
// v2.1
// =====================================================

const STATIC_CACHE = "floraquiz-static-v3";

const IMAGE_CACHE = "floraquiz-images-v3";

const MAX_IMAGE_CACHE_ITEMS = 300;

const STATIC_FILES = [

    "./",
    "./index.html",
    "./quiz.html",
    "./css/style.css",
    "./js/app.js",
    "./js/quiz.js",
    "./js/storage.js",
    "./js/config.js",
    "./js/database.js",
    "./js/update.js",
    "./data/plants.json",
    "./data/version.json",
    "./data/images.json",
    "./images/no-image.png",
    "./manifest.json"
];

// -----------------------------------------------------
// Install
// -----------------------------------------------------

self.addEventListener("install", event => {

    event.waitUntil(

		caches.open(STATIC_CACHE)

            .then(cache => await Promise.all(

                STATIC_FILES.map(file =>

                    cache.add(file)

                        .catch(() => {})

                )

            )
            )
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

                keys
                    .filter(key =>
                        key !== STATIC_CACHE &&
                        key !== IMAGE_CACHE
                    )
                    .map(key => caches.delete(key))

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

        const response = await fetch(request, {

            cache: "no-cache"

        });

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

    if (event.request.method !== "GET") {

        return;

    }
    
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

        fetch(event.request)

        .catch(() => caches.match(event.request) 
            || caches.match("./index.html"))

    );

});