let correct = 0;
let total = 0;
let plants = [];
let currentPlant = null;
let mode = localStorage.getItem("quizMode") || "image";
let correctAnswer = "";
const category =
    localStorage.getItem("category") || "trees";

// Adatok betöltése
fetch("data/plants.json")
    .then(response => response.json())
    .then(data => {
        plants = data.filter(
            plant => plant.category === category
        );
        nextPlant();
    });

// Véletlen növény
function nextPlant() {

    if (plants.length === 0) {

        alert("Ebben a kategóriában még nincs növény.");

        return;
    }

    if (mode === "mixed") {

        const modes = ["image", "hungarian", "latin"];
        mode = modes[Math.floor(Math.random() * modes.length)];

    }

    const random = Math.floor(Math.random() * plants.length);
    currentPlant = plants[random];

    const img = document.getElementById("plantImage");
    const question = document.getElementById("question");

    img.style.display = "none";
    question.innerHTML = "";

    switch(mode){

        case "image":
            question.innerHTML = "Mi ennek a latin neve?";
            img.src = currentPlant.images[0];
            img.style.display = "block";
            break;

        case "hungarian":
            question.innerHTML = currentPlant.hungarian;
            break;

        case "latin":
            question.innerHTML = currentPlant.latin;
            break;

    }

    document.getElementById("hungarian").innerText = currentPlant.hungarian;
    document.getElementById("latin").innerText = currentPlant.latin;

    document.getElementById("answer").classList.add("hidden");

    createAnswers();

    document
        .getElementById("nextButton")
        .classList
        .add("hidden");
}

// Válasz megjelenítése
document.getElementById("showButton").addEventListener("click", () => {

    document.getElementById("answer").classList.remove("hidden");

});

// Következő
document.getElementById("nextButton").addEventListener("click", nextPlant);

function createAnswers() {

    const container = document.getElementById("answers");
    container.innerHTML = "";

    // Helyes válasz
    correctAnswer =
        mode === "latin"
            ? currentPlant.hungarian
            : currentPlant.latin;

    let options = [correctAnswer];

    // Véletlen hibás válaszok
    while(options.length < 4){

        const wrongAnswer =
        mode === "latin"
            ? random.hungarian
            : random.latin;

        if (!options.includes(wrongAnswer))
            options.push(wrongAnswer);
    }

    // Keverés
    options.sort(()=>Math.random()-0.5);

    options.forEach(option=>{

        const btn=document.createElement("button");

        btn.className="answerBtn";

        btn.innerText=option;

        btn.onclick=()=>checkAnswer(btn,option);

        container.appendChild(btn);

    });

}

function checkAnswer(button, answer){

    total++;
    const buttons =
        document.querySelectorAll(".answerBtn");

    buttons.forEach(btn=>btn.disabled=true);

    if (answer === correctAnswer) {

        correct++;
        button.classList.add("correct");

    }else{

        button.classList.add("wrong");

        buttons.forEach(btn=> {

            if (btn.innerText===correctAnswer){

                btn.classList.add("correct");

            }

        });
        
    }

    document
        .getElementById("nextButton")
        .classList
        .remove("hidden");

    updateScore();

}

function updateScore(){

    document.getElementById("correctCount").innerText = correct;

    document.getElementById("totalCount").innerText = total;

}