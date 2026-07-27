// =====================================================
// FloraQuiz v1.0 Final
// app.js
// =====================================================

"use strict";

document.getElementById("correctCount").innerText =
    getCorrectCount();

document.getElementById("totalCount").innerText =
    getTotalCount();


function startQuiz(mode) {

    setQuizMode(mode);

    location.href = "quiz.html";

	const update = await checkForUpdates();

	if (update) {

		const answer = confirm(

			"Új adatbázis érhető el.\n\n" +

			"Növények: " +

			update.plants +

			"\n\nLetöltöd?"

		);

		if (answer) {

			// következő lépés

		}

	}	

}

function setCategory(category) {

    setCategoryStorage(category);

}

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        await startUpdate();

    }

);

console.log("🌿 FloraQuiz v1.0");