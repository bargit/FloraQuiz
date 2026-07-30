"use strict";

// =====================================================
// FloraQuiz v2.0 Final
// quiz.js
// =====================================================

// ----------------------------
// Állandók
// ----------------------------

const NEXT_DELAY = 2000;

// ----------------------------
// Állapot
// ----------------------------

let plants = [];
let currentPlant = null;
let questionQueue = [];
let currentMode = "";
let correctAnswer = "";
let lastPlantId = -1;

// ----------------------------
// DOM elemek
// ----------------------------

const imageElement = document.getElementById("plantImage");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");

const answerElement = document.getElementById("answer");
const hungarianElement = document.getElementById("hungarian");
const latinElement = document.getElementById("latin");

const correctElement = document.getElementById("correctCount");
const totalElement = document.getElementById("totalCount");

const categoryTitle = document.getElementById("categoryTitle");

// ----------------------------
// Kategórianevek
// ----------------------------

const categoryNames = {

    trees: "🌳 Magyarország fái",

    wildflowers: "🌼 Vadvirágok",

    herbs: "🌱 Gyógynövények",

    ornamentals: "🌵 Dísznövények"

};

// =====================================================
// Indítás
// =====================================================

initialize();

async function initialize() {
console.log(

    "Database exists:",

    await databaseExists()

);

console.log(

    "Database version:",

    await getDatabaseVersion()

);

console.log(

    "Last update:",

    await getLastUpdate()

);
    try {

        categoryTitle.innerText = categoryNames[getCategory()] || "";

        updateScore();

        if (

            await databaseEmpty()

        ) {

            const response = await fetch("data/plants.json");

            const data = await response.json();

            await savePlantsDatabase(data);

        }

        await startUpdate();

        plants = await loadPlantsDatabase();

        plants = plants.filter(

            plant =>

                plant.category ===

                getCategory()

        );

        if (plants.length === 0) {

            alert("Ebben a kategóriában nincs növény.");

            return;

        }

        preloadImages();

        nextQuestion();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

function updateScore() {

    correctElement.innerText =
        getCorrectCount();

    totalElement.innerText =
        getTotalCount();

}

// =====================================================
// Prefetch képek
// =====================================================

function prefetchPlantImages(plant) {

    if (!plant?.images?.length) {

        return;

    }

    plant.images.forEach(image => {

        fetch(image, {
            cache: "force-cache"
        }).catch(() => {});

    });

}

// =====================================================
// Következő kérdés előkészítése
// =====================================================

function nextQuestion() {

    answerElement.classList.add("hidden");

    fillQuestionQueue();

    currentPlant = questionQueue.shift();

    currentMode = chooseMode();

    fillQuestionQueue();

    showQuestion();

}

// =====================================================
// Kérdéspuffer feltöltése
// =====================================================

function fillQuestionQueue() {

    while (questionQueue.length < 2) {

        const plant = choosePlant();

        questionQueue.push(plant);

        prefetchPlantImages(plant);

    }

}

// =====================================================

// =====================================================
// Növénylista beállítása
// =====================================================

function setPlants(allPlants) {

    plants = allPlants.filter(

        plant => plant.category === getCategory()

    );

    if (plants.length === 0) {

        alert("Ebben a kategóriában nincs növény.");

        return false;

    }

    window.plants = plants;

    preloadImages();

    nextQuestion();

    return true;

}

window.setPlants = setPlants;

function choosePlant() {

    const weightedPlants = [];

    plants.forEach(plant => {

        const stat = getPlantStats(plant.id);

        let weight = 1;

        weight += stat.wrong * 4;
        weight -= stat.correct;

        if (weight < 1) {

            weight = 1;

        }

        for (let i = 0; i < weight; i++) {

            weightedPlants.push(plant);

        }

    });

    if (weightedPlants.length === 1) {

        lastPlantId = weightedPlants[0].id;

        return weightedPlants[0];

    }

    let selectedPlant;

    do {

        selectedPlant =
            weightedPlants[
                Math.floor(
                    Math.random() *
                    weightedPlants.length
                )
            ];

    } while (selectedPlant.id === lastPlantId);

    lastPlantId = selectedPlant.id;

    return selectedPlant;

}

// =====================================================

function chooseMode() {

    const quizMode = getQuizMode();

    if (quizMode !== "mixed") {

        return quizMode;

    }

    const modes = [

        "image",

        "hungarian",

        "latin"

    ];

    return modes[
        Math.floor(
            Math.random() *
            modes.length
        )
    ];

}

// =====================================================

function showQuestion() {

    answersElement.innerHTML = "";

    answerElement.classList.add("hidden");

    imageElement.src = "";

    imageElement.style.display = "none";

    if (currentMode === "image") {

        questionElement.innerText =
            "Mi ennek a latin neve?";

        const randomImage =
            currentPlant.images[
                Math.floor(
                    Math.random() *
                    currentPlant.images.length
                )
            ];

        const preload = new Image();

        preload.onload = () => {

            imageElement.src = randomImage;

            imageElement.style.display = "block";

        };

        preload.onerror = () => {

            imageElement.src =
                "images/no-image.png";

            imageElement.style.display = "block";

        };

        preload.src = randomImage;

        correctAnswer =
            currentPlant.latin;

    }

    else if (currentMode === "hungarian") {

        questionElement.innerText =
            currentPlant.hungarian;

        correctAnswer =
            currentPlant.latin;

    }

    else {

        questionElement.innerText =
            currentPlant.latin;

        correctAnswer =
            currentPlant.hungarian;

    }

    hungarianElement.innerText =
        currentPlant.hungarian;

    latinElement.innerText =
        currentPlant.latin;

    createAnswers();

}

// =====================================================

function createAnswers() {

    answersElement.innerHTML = "";

    const options = [correctAnswer];

    const maxAnswers = Math.min(4, plants.length);

    while (options.length < maxAnswers) {

        const randomPlant =
            plants[
                Math.floor(
                    Math.random() * plants.length
                )
            ];

		let answer;

		switch (currentMode) {

			case "image":
			case "hungarian":

				answer = randomPlant.latin;
				break;

			case "latin":

				answer = randomPlant.hungarian;
				break;

		}
        if (!options.includes(answer)) {

            options.push(answer);

        }

    }

    shuffle(options);

    const letters = ["A", "B", "C", "D"];

    options.forEach((answer, index) => {

        const button =
            document.createElement("button");

        button.className = "answerBtn";

        button.dataset.answer = answer;

        button.innerHTML = `
            <span class="letter">${letters[index]}</span>
            <span>${answer}</span>
        `;

        button.onclick = () =>
            checkAnswer(button, answer);

        answersElement.appendChild(button);

    });

}

// =====================================================

function checkAnswer(button, answer) {

    let correct =
        getCorrectCount();

    let total =
        getTotalCount();

    total++;

    const buttons =
        document.querySelectorAll(".answerBtn");

    buttons.forEach(btn => {

        btn.disabled = true;

    });

    if (answer === correctAnswer) {

        correct++;

        updatePlantStats(
            currentPlant.id,
            true
        );

        button.classList.add("correct");

    }

    else {

        updatePlantStats(
            currentPlant.id,
            false
        );

        button.classList.add("wrong");

        buttons.forEach(btn => {

            if (
                btn.dataset.answer ===
                correctAnswer
            ) {

                btn.classList.add("correct");

            }

        });

    }

    setCorrectCount(correct);

    setTotalCount(total);

    updateScore();

    answerElement.classList.remove("hidden");

    setTimeout(
        nextQuestion,
        NEXT_DELAY
    );

}

// =====================================================

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];

    }

    return array;

}

// =====================================================
// Képek előtöltése
// =====================================================

function preloadImages() {

    plants.forEach(plant => {

        if (!plant.images) {
            return;
        }

        plant.images.forEach(image => {

            const img = new Image();

            img.src = image;

        });

    });

}

// =====================================================
// Kép hiba kezelése
// =====================================================

imageElement.onerror = () => {

    imageElement.src = "images/no-image.png";

};

// =====================================================
// Billentyűzet támogatás
// =====================================================

document.addEventListener("keydown", (event) => {

    const buttons =
        document.querySelectorAll(".answerBtn");

    switch (event.key) {

        case "1":
        case "a":
        case "A":

            if (buttons[0]) buttons[0].click();

            break;

        case "2":
        case "b":
        case "B":

            if (buttons[1]) buttons[1].click();

            break;

        case "3":
        case "c":
        case "C":

            if (buttons[2]) buttons[2].click();

            break;

        case "4":
        case "d":
        case "D":

            if (buttons[3]) buttons[3].click();

            break;

    }

});

// =====================================================
// Vége
// =====================================================