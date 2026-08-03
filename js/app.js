// =====================================================
// FloraQuiz v1.0 Final
// app.js
// =====================================================

"use strict";

async function initialize() {

    try {

        updateScore();

        await autoUpdateDatabase();

    }

    catch (error) {

        console.error(error);

    }

}

function updateScore() {

    document.getElementById(

        "correctCount"

    ).innerText = getCorrectCount();

    document.getElementById(

        "totalCount"

    ).innerText = getTotalCount();

}

function startQuiz(mode) {

    setQuizMode(mode);

    location.href = "quiz.html";	

}

function selectCategory(category) {

    setCategoryStorage(category);

}

// =====================================================
// Service Worker
// =====================================================

if ("serviceWorker" in navigator && ENABLE_SERVICE_WORKER) {

    navigator.serviceWorker
        .register("./sw.js")
        .then(() => {

            log("Service Worker regisztrálva.");

    })
    .catch(error => {

        log(error);

    });

}

// =====================================================
// Application indítása
// =====================================================

initialize();
log("🌿 FloraQuiz ", APP_VERSION);