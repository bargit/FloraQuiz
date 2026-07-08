let plants = [];
let currentPlant = null;

async function loadPlants() {
    const response = await fetch("data/plants.json");
    plants = await response.json();
}