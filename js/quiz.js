// ==========================
// FloraQuiz v2.0
// ==========================

let plants = [];
let currentPlant = null;
let lastPlantId = -1;

let mode = localStorage.getItem("quizMode") || "image";
let category = localStorage.getItem("category") || "trees";

let correct = Number(localStorage.getItem("correct")) || 0;
let total = Number(localStorage.getItem("total")) || 0;

let correctAnswer = "";

//----------------------------------

const categoryNames = {

    trees: "🌳 Magyarország fái",
    wildflowers: "🌼 Vadvirágok",
    herbs: "🌱 Gyógynövények",
    ornamentals: "🌵 Dísznövények"

};

document.getElementById("categoryTitle").innerText =
    categoryNames[category];

//----------------------------------

fetch("data/plants.json")

.then(response => response.json())

.then(data => {

    plants = data.filter(p => p.category === category);

    updateScore();

    nextPlant();

});

//----------------------------------

function updateScore(){

    document.getElementById("correctCount").innerText = correct;
    document.getElementById("totalCount").innerText = total;

}

//----------------------------------

function nextPlant(){

    if(plants.length===0){

        alert("Ebben a kategóriában nincs növény.");

        return;

    }

    const weighted = [];

    plants.forEach(plant => {

        const stat = getPlantStats(plant.id);

        let weight = 1;

        weight += stat.wrong * 4;

        weight -= stat.correct;

        if (weight < 1) weight = 1;

        for (let i = 0; i < weight; i++) {

            weighted.push(plant);

        }

    });

    let candidate;

    do {

        candidate = weighted[Math.floor(Math.random() * weighted.length)];

    } while (candidate.id === lastPlantId && weighted.length > 1);

    currentPlant = candidate;

    lastPlantId=currentPlant.id;

    let currentMode=mode;

    if(mode==="mixed"){

        const modes=["image","hungarian","latin"];

        currentMode=modes[Math.floor(Math.random()*3)];

    }

    showQuestion(currentMode);

}

//----------------------------------

function showQuestion(currentMode){

    const img=document.getElementById("plantImage");

    const question=document.getElementById("question");

    img.style.display="none";

    switch(currentMode){

        case "image":

            question.innerHTML="Mi ennek a latin neve?";

            img.src=currentPlant.images[0];

            img.style.display="block";

            correctAnswer=currentPlant.latin;

            break;

        case "hungarian":

            question.innerHTML=currentPlant.hungarian;

            correctAnswer=currentPlant.latin;

            break;

        case "latin":

            question.innerHTML=currentPlant.latin;

            correctAnswer=currentPlant.hungarian;

            break;

    }

    document.getElementById("hungarian").innerText=currentPlant.hungarian;
    document.getElementById("latin").innerText=currentPlant.latin;

    createAnswers(currentMode);

}

//----------------------------------

function createAnswers(currentMode){

    const container=document.getElementById("answers");

    container.innerHTML="";

    let options=[correctAnswer];

    while(options.length<4){

        const randomPlant=
            plants[Math.floor(Math.random()*plants.length)];

        const answer=currentMode==="latin"
            ? randomPlant.hungarian
            : randomPlant.latin;

        if(!options.includes(answer)){

            options.push(answer);

        }

    }

    options.sort(()=>Math.random()-0.5);

    options.forEach(answer=>{

        const btn=document.createElement("button");

        btn.className="answerBtn";

        btn.innerText=answer;

        btn.onclick=()=>checkAnswer(btn,answer);

        container.appendChild(btn);

    });

}

//----------------------------------

function checkAnswer(button,answer){

    total++;

    const buttons=document.querySelectorAll(".answerBtn");

    buttons.forEach(btn=>btn.disabled=true);

    if(answer===correctAnswer){

        correct++;
        updatePlant(true);
        button.classList.add("correct");

    }else{

        updatePlant(false);
        button.classList.add("wrong");

        buttons.forEach(btn=>{

            if(btn.innerText===correctAnswer){

                btn.classList.add("correct");

            }

        });

    }

    localStorage.setItem("correct",correct);
    localStorage.setItem("total",total);

    updateScore();

    setTimeout(nextPlant,2000);

}