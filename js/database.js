// =====================================================
// FloraQuiz
// Database Engine v1.0
// IndexedDB
// =====================================================

"use strict";

const DB_NAME = "FloraQuizDB";
const DB_VERSION = 1;
const STORE = "plants";

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
			
			if (!db.objectStoreNames.contains("settings")) {

                db.createObjectStore(

                    "settings",

                    {

                        keyPath: "key"

                    }

                );

            }

            if (!db.objectStoreNames.contains("stats")) {

                db.createObjectStore(

                    "stats",

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

    return new Promise(resolve => {

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

// -----------------------------------------------------

async function databaseEmpty() {

    const plants =

        await loadPlantsDatabase();

    return plants.length === 0;

}

// =====================================================
// Beállítás lekérdezése
// =====================================================

async function getSetting(key) {

    const db = await openDatabase();

    return new Promise((resolve, reject) => {

        const tx = db.transaction(

            "settings",

            "readonly"

        );

        const request =

            tx.objectStore("settings")

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

            "settings",

            "readwrite"

        );

        tx.objectStore("settings")

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

// -----------------------------------------------------
// Utolsó frissítés
// -----------------------------------------------------

async function getLastUpdate() {

    return await getSetting(

        "lastUpdate"

    );

}

async function setLastUpdate() {

    await setSetting(

        "lastUpdate",

        new Date().toISOString()

    );

}

// -----------------------------------------------------
// Adatbázis létezik?
// -----------------------------------------------------

async function databaseExists() {

    const plants =
        await loadPlantsDatabase();

    return plants.length > 0;

}