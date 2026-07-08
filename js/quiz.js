let plants = [];
let currentPlant = null;

fetch("data/plants.json")
    .then(response => response.json())
    .then(data => {
        plants = data;
        nextPlant();
    });

function nextPlant() {

    currentPlant = plants[Math.floor(Math.random() * plants.length)];

    document.getElementById("plantImage").src = currentPlant.image;

    document.getElementById("hungarian").innerText = currentPlant.hungarian;

    document.getElementById("latin").innerText = currentPlant.latin;

    document.getElementById("answer").classList.add("hidden");

}

document.getElementById("showButton").onclick = () => {

    document.getElementById("answer").classList.remove("hidden");

};

document.getElementById("nextButton").onclick = nextPlant;