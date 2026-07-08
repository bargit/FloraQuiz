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

}

// Válasz megjelenítése
document.getElementById("showButton").addEventListener("click", () => {

    document.getElementById("answer").classList.remove("hidden");

});

// Következő
document.getElementById("nextButton").addEventListener("click", nextPlant);