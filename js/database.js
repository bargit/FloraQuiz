// =====================================================
// FloraQuiz Database
// =====================================================

"use strict";

const DB_NAME = "FloraQuiz";

const DB_VERSION = 1;

const STORE = "plants";

// -----------------------------------------------------
// Adatbázis megnyitása
// -----------------------------------------------------

async function openDatabase() {

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(

            DB_NAME,

            DB_VERSION

        );

        request.onupgradeneeded = () => {

            const db = request.result;

            if (!db.objectStoreNames.contains(STORE)) {

                db.createObjectStore(

                    STORE,

                    {

                        keyPath: "id"

                    }

                );

            }

        };

        request.onsuccess = () => {

            resolve(request.result);

        };

        request.onerror = () => {

            reject(request.error);

        };

    });

}

async function savePlantsToDatabase(plants) {

    const db = await openDatabase();

    const tx = db.transaction(

        STORE,

        "readwrite"

    );

    const store = tx.objectStore(STORE);

    await store.clear();

    plants.forEach(plant => {

        store.put(plant);

    });

    return tx.done;

}

async function loadPlantsFromDatabase() {

    const db = await openDatabase();

    return new Promise((resolve, reject) => {

        const tx = db.transaction(

            STORE,

            "readonly"

        );

        const store = tx.objectStore(STORE);

        const request = store.getAll();

        request.onsuccess = () => {

            resolve(request.result);

        };

        request.onerror = () => {

            reject(request.error);

        };

    });

}