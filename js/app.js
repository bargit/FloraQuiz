console.log("🌿 FloraQuiz elindult!");

let selectedCategory = "trees";

function selectCategory(category) {

    selectedCategory = category;

    localStorage.setItem("category", category);

}

function startQuiz(selectedMode) {

    localStorage.setItem("quizMode", selectedMode);
    localStorage.setItem("category", selectedCategory);

    location.href = "quiz.html";

}