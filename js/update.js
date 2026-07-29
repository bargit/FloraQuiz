// =====================================================
// FloraQuiz
// Online Update Engine
// v2.2
// =====================================================

"use strict";

// -----------------------------------------------------
// Beállítások
// -----------------------------------------------------

const UPDATE_URL = "data/version.json";

const VERSION_KEY = "floraquiz-version";

// -----------------------------------------------------
// Verzió ellenőrzése
// -----------------------------------------------------

async function checkForUpdates() {

    try {

        const response = await fetch(

            UPDATE_URL,

            {

                cache: "no-cache"

            }

        );

        if (!response.ok) {

            return null;

        }

        const remote = await response.json();

        const localVersion = Number(

            localStorage.getItem(

                VERSION_KEY

            ) || 0

        );

        if (

            remote.version >

            localVersion

        ) {

            return {

                update: true,

                remote

            };

        }

        return {

            update: false,

            remote

        };

    }

    catch (error) {

        console.error(error);

        return null;

    }

}

function getInstalledVersion() {

    return Number(

        localStorage.getItem(

            VERSION_KEY

        ) || 0

    );

}

function saveInstalledVersion(version) {

    localStorage.setItem(

        VERSION_KEY,

        version

    );

}

// =====================================================
// Új adatbázis letöltése
// =====================================================

async function downloadPlantsDatabase() {

    const response = await fetch(

        "data/plants.json",

        {

            cache: "no-cache"

        }

    );

    if (!response.ok) {

        throw new Error(

            "Nem sikerült letölteni a plants.json fájlt."

        );

    }

    return await response.json();

}

// =====================================================
// Frissítés végrehajtása
// =====================================================

async function performUpdate(remoteVersion) {

    try {

        const newPlants = await downloadPlantsDatabase();

        // Globális növénylista frissítése

		window.setPlants(newPlants);

        saveInstalledVersion(remoteVersion.version);

        alert("Az adatbázis sikeresen frissült.");

    }

    catch (error) {

        console.error(error);

        alert("A frissítés nem sikerült.");

    }

}

// -----------------------------------------------------
// Frissítés indítása
// -----------------------------------------------------

async function startUpdate() {

    const result =
        await checkForUpdates();

    if (!result) {

        return;

    }

    if (!result.update) {

        return;

    }

    const answer = confirm(

        "Új növényadatbázis érhető el.\n\n" +

        "Növények: " +

        result.remote.plants +

        "\n" +

        "Képek: " +

        result.remote.images +

        "\n\n" +

        "Szeretnéd letölteni?"

    );

    if (!answer) {

        return;

    }

    console.log("Downloading database...");

	await performUpdate(

		result.remote

	);
}