let correct = 0;
let total = 0;
let plants = [];
let currentPlant = null;
let mode = "image";

// Adatok betöltése
fetch("data/plants.json")
    .then(response => response.json())
    .then(data => {
        plants = data;
        nextPlant();
    });

// Véletlen növény
function nextPlant() {

    const random = Math.floor(Math.random() * plants.length);
    currentPlant = plants[random];

    const img = document.getElementById("plantImage");
    const question = document.getElementById("question");

    img.style.display = "none";
    question.innerHTML = "";

    switch(mode){

        case "image":
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
    let options = [currentPlant.latin];

    // Véletlen hibás válaszok
    while(options.length < 4){

        const random =
            plants[Math.floor(Math.random()*plants.length)];

        if(!options.includes(random.latin))
            options.push(random.latin);

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

    if(answer===currentPlant.latin){

        correct++;
        button.classList.add("correct");

    }else{

        button.classList.add("wrong");

        buttons.forEach(btn=>{

            if(btn.innerText===currentPlant.latin){

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