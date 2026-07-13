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

}

function setCategory(category) {

    setCategoryStorage(category);

}

console.log("🌿 FloraQuiz v1.0");