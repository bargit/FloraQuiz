// =====================================================
// FloraQuiz
// Database Engine v1.0
// IndexedDB
// =====================================================

"use strict";

const DB_NAME = "FloraQuizDB";
const DB_VERSION = 1;
const STORE = "plants";
const SETTINGS_STORE = "settings";
const STATS_STORE = "stats";
let db = null;

// -----------------------------------------------------

async function openDatabase() {

    if (db) {

        return db;

    }

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(

            DB_NAME,

            DB_VERSION

        );

        request.onupgradeneeded = event => {

            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE)) {

                db.createObjectStore(

                    STORE,

                    {

                        keyPath: "id"

                    }

                );

            }
			
			if (!db.objectStoreNames.contains(SETTINGS_STORE)) {

                db.createObjectStore(

                    SETTINGS_STORE,

                    {

                        keyPath: "key"

                    }

                );

            }

            if (!db.objectStoreNames.contains(STATS_STORE)) {

                db.createObjectStore(

                    STATS_STORE,

                    {

                        keyPath: "id"

                    }

                );

            }
        };

        request.onsuccess = () => {

            db = request.result;

            resolve(db);

        };

        request.onerror = () => {

            reject(request.error);

        };

    });

}

// -----------------------------------------------------
// JSON letöltése
// -----------------------------------------------------

async function fetchJson(url) {

    const response = await fetch(url, {

        cache: "no-cache"

    });

    if (!response.ok) {

        throw new Error("Nem sikerült letölteni: " + url);

    }

    return await response.json();

}

// -----------------------------------------------------

async function clearDatabase() {

    const db = await openDatabase();

    return new Promise(resolve => {

        const tx = db.transaction(

            STORE,

            "readwrite"

        );

        tx.objectStore(STORE).clear();

        tx.oncomplete = () => resolve();

    });

}

// -----------------------------------------------------

async function savePlantsDatabase(plants) {

    const db = await openDatabase();

    const tx = db.transaction(

        STORE,

        "readwrite"

    );

    const store = tx.objectStore(STORE);

    for (const plant of plants) {

        store.put(plant);

    }

    return new Promise(resolve => {

        tx.oncomplete = resolve;

    });

}

// -----------------------------------------------------

async function loadPlantsDatabase() {

    const db = await openDatabase();

    return new Promise((resolve, reject) => {

        const tx = db.transaction(

            STORE,

            "readonly"

        );

        const request =

            tx.objectStore(STORE)

                .getAll();

        request.onsuccess = () => {

            resolve(request.result);

        };
		
		request.onerror = () => {

            reject(request.error);

        };

    });

}

// =====================================================
// Beállítás lekérdezése
// =====================================================

async function getSetting(key) {

    const db = await openDatabase();

    return new Promise((resolve, reject) => {

        const tx = db.transaction(

            SETTINGS_STORE,

            "readonly"

        );

        const request =

            tx.objectStore(SETTINGS_STORE)

              .get(key);

        request.onsuccess = () => {

            if (request.result) {

                resolve(request.result.value);

            }

            else {

                resolve(null);

            }

        };

        request.onerror = () => {

            reject(request.error);

        };

    });

}

// =====================================================
// Beállítás mentése
// =====================================================

async function setSetting(key, value) {

    const db = await openDatabase();

    return new Promise((resolve, reject) => {

        const tx = db.transaction(

            SETTINGS_STORE,

            "readwrite"

        );

        tx.objectStore(SETTINGS_STORE)

          .put({

              key,

              value

          });

        tx.oncomplete = () => {

            resolve();

        };

        tx.onerror = () => {

            reject(tx.error);

        };

    });

}

// =====================================================
// Database Manager
// v1.1
// =====================================================

// -----------------------------------------------------
// Adatbázis verzió
// -----------------------------------------------------

async function getDatabaseVersion() {

    const version =
        await getSetting("databaseVersion");

    return version || 0;

}

async function setDatabaseVersion(version) {

    await setSetting(

        "databaseVersion",

        version

    );

}

// =====================================================
// Version Check Time
// =====================================================

async function getLastVersionCheck() {

    return await getSetting("lastVersionCheck");

}

async function setLastVersionCheck(value = Date.now()) {

    await setSetting("lastVersionCheck", value);

}

// -----------------------------------------------------
// Letelt-e az ellenőrzési idő?
// -----------------------------------------------------

async function shouldCheckForUpdates() {

    const last = await getLastVersionCheck();

    if (!last) {

        return true;

    }

    return Date.now() - last > UPDATE_INTERVAL;

}

// -----------------------------------------------------
// Utolsó frissítés
// -----------------------------------------------------

async function getLastUpdate() {

    return await getSetting("lastUpdate");

}

async function setLastUpdate(value = new Date().toISOString()) {

    await setSetting("lastUpdate", value);

}

// -----------------------------------------------------
// Adatbázis létezik?
// -----------------------------------------------------

async function databaseExists() {

    const plants =
        await loadPlantsDatabase();

    return plants.length > 0;

}

// -----------------------------------------------------
// Távoli verzió letöltése
// -----------------------------------------------------

async function getRemoteVersion() {

    return await fetchJson("data/version.json");

}

// -----------------------------------------------------
// Adatbázis frissítése
// -----------------------------------------------------

async function updateDatabase() {

    const plants = await fetchJson("data/plants.json");

    await clearDatabase();

    await savePlantsDatabase(plants);

    const remote = await getRemoteVersion();

    await setDatabaseVersion(remote.version);

    await setLastUpdate();

//    await downloadMissingImages();

    return remote;

}

// =====================================================
// Képlista letöltése
// =====================================================

async function getRemoteImageList() {

    return await fetchJson("data/images.json");
}