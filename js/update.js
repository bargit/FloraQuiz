// =====================================================
// FloraQuiz
// Online Update Engine
// v2.2
// =====================================================

"use strict";

// =====================================================
// Verzió ellenőrzése
// =====================================================

async function checkForUpdates() {

    try {

        const localVersion = await getDatabaseVersion();

        const remote = await fetchJson(UPDATE_URL);

        return {

            update:

                remote.version >

                localVersion,

            localVersion,

            remote

        };

    }

    catch (error) {

        console.error("Update check failed:",error);

        return null;

    }

}

// =====================================================
// Frissítés indítása
// =====================================================

async function performUpdate() {

    const remote = await updateDatabase();

    return remote;

}

async function startUpdate() {

    if (DEV_MODE) {
        
        log("Developer mode - online update disabled.");
        return;

    }

    const result = await checkForUpdates();

    if (!result) {

        return false;

    }

    if (!result.update) {

        console.log("Az adatbázis naprakész.");

        return false;

    }

    const answer = confirm(

        "Új növényadatbázis érhető el.\n\n" +

        "Növények: " +

        result.remote.plants +

        "\nKépek: " +

        result.remote.images +

        "\n\nSzeretnéd letölteni?"

    );

    if (!answer) {

        return false;

    }

    await performUpdate();

    alert(

        "Sikeres frissítés.\n\n" +

        "Verzió: " +

        remote.version

    );
    location.reload();

}

// =====================================================
// Smart Update Engine
// =====================================================

async function autoUpdateDatabase() {

    try {

        if (!(await shouldCheckForUpdates())) {

            console.log("Version check skipped.");

            return false;

        }

        await setLastVersionCheck();

        log("Checking for updates...");

        const result =

            await checkForUpdates();

        if (!result) {

            return false;

        }

        if (!result.update) {

            console.log("Database is up to date.");

            return false;

        }

        log("Downloading update...");

        await performUpdate();

        log("Update completed.");

        return true;

    }

    catch (error) {

        console.error(error);

        return false;

    }

}

async function downloadMissingImages() {

    const images = await getRemoteImageList();

    const cache = await caches.open(IMAGE_CACHE);

    for (const image of images) {

        const cached = await cache.match(image);

        if (cached) {

            continue;

        }

        log("Downloading:", image);

        const response =

            await fetch(

                image,

                {

                    cache: "no-cache"

                }

            );

        if (response.ok) {

            await cache.put(

                image,

                response.clone()

            );

        }

    }

}