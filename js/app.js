let selectedCategory = "trees";

function selectCategory(category){

    selectedCategory = category;

    localStorage.setItem("category",category);

    document.querySelectorAll(".buttonGroup:first-of-type button")
        .forEach(btn=>btn.style.background="#2e7d32");

    event.target.style.background="#1b5e20";

}

function startQuiz(mode){

    localStorage.setItem("quizMode",mode);

    localStorage.setItem("category",selectedCategory);

    location.href="quiz.html";

}

function resetLearning() {

    if (confirm("Biztosan törlöd a tanulási statisztikát?")) {

        localStorage.removeItem("plantStats");
        localStorage.removeItem("correct");
        localStorage.removeItem("total");

        alert("A statisztika törölve.");

    }

}