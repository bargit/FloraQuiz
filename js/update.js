// =====================================================
// FloraQuiz
// Online Update Engine
// v2.2
// =====================================================

"use strict";

// -----------------------------------------------------
// Beállítások
// -----------------------------------------------------

const UPDATE_URL =
    "https://bargit.github.io/FloraQuiz/data/version.json";

const LOCAL_VERSION =
    "data/version.json";

// -----------------------------------------------------
// Verzió ellenőrzése
// -----------------------------------------------------

async function checkForUpdates() {

    try {

        const localResponse =
            await fetch(
                LOCAL_VERSION,
                {
                    cache: "no-cache"
                }
            );

        const remoteResponse =
            await fetch(
                UPDATE_URL,
                {
                    cache: "no-cache"
                }
            );

        if (
            !localResponse.ok ||
            !remoteResponse.ok
        ) {

            return null;

        }

        const local =
            await localResponse.json();

        const remote =
            await remoteResponse.json();

        if (
            remote.version >
            local.version
        ) {

            return {

                update: true,

                local,

                remote

            };

        }

        return {

            update: false,

            local,

            remote// -----------------------------------------------------
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

    // A letöltés a következő modulban készül el

    console.log(

        "Downloading database..."

    );

}

        };

    }

    catch (error) {

        console.error(
            "Update check failed:",
            error
        );

        return null;

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

    // A letöltés a következő modulban készül el

    console.log(

        "Downloading database..."

    );

}