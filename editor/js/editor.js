"use strict";

// =====================================================
// FloraQuiz Editor v1.0
// editor.js
// =====================================================

// ----------------------------
// Adatok
// ----------------------------

let plants = [];
let filteredPlants = [];
let currentPlant = null;
let projectOpened = false;

// ----------------------------
// DOM
// ----------------------------

const openButton = document.getElementById("openProject");
const searchBox = document.getElementById("search");
const plantList = document.getElementById("plantList");
const status = document.getElementById("status");
const idInput = document.getElementById("id");
const categoryInput = document.getElementById("category");
const hungarianInput = document.getElementById("hungarian");
const latinInput = document.getElementById("latin");
const familyInput = document.getElementById("family");
const genusInput = document.getElementById("genus");
const imageList = document.getElementById("imageList");
const saveButton = document.getElementById("savePlant");
const deleteButton = document.getElementById("deletePlant");
const newButton = document.getElementById("newPlant");
const addImageButton = document.getElementById("addImage");

initialize();

function initialize() {

    disableEditor();

    status.innerText =
        "Projekt nincs megnyitva.";

}

function disableEditor() {

    categoryInput.disabled = true;
    hungarianInput.disabled = true;
    latinInput.disabled = true;
    familyInput.disabled = true;
    genusInput.disabled = true;
    saveButton.disabled = true;
    deleteButton.disabled = true;
    addImageButton.disabled = true;

}

function enableEditor() {

    categoryInput.disabled = false;
    hungarianInput.disabled = false;
    latinInput.disabled = false;
    familyInput.disabled = false;
    genusInput.disabled = false;
    saveButton.disabled = false;
    deleteButton.disabled = false;
    addImageButton.disabled = false;

}

// =====================================================
// Projekt megnyitása
// =====================================================

openButton.onclick = async () => {

    try {

        const folder = await window.api.selectProject();

        if (!folder) {
            return;
        }

        plants = await window.api.loadPlants();

        filteredPlants = [...plants];

        projectOpened = true;

        renderPlantList();

        enableEditor();

        status.innerText = "Projekt betöltve.";

    }

    catch (error) {

        console.error(error);

        alert("Nem sikerült betölteni a projektet.");

    }

};

// =====================================================
// Lista
// =====================================================

function renderPlantList() {

    plantList.innerHTML = "";

    filteredPlants.sort((a, b) => a.hungarian.localeCompare(b.hungarian, "hu"));

    filteredPlants.forEach(plant => {

        const div = document.createElement("div");

        div.className = "plantItem";

        if (currentPlant && plant.id === currentPlant.id) {

            div.classList.add("active");

        }

        div.innerHTML = `

            <strong>${plant.hungarian}</strong>
            <br>
            <small>${plant.latin}</small>`;

        div.onclick = () => {selectPlant(plant.id);};

        plantList.appendChild(div);

    });

}

function selectPlant(id) {

    currentPlant = plants.find(plant => plant.id === id);

    if (!currentPlant) {

        return;

    }

    loadPlant();
    renderPlantList();

}

function loadPlant() {

    idInput.value = currentPlant.id;
    categoryInput.value = currentPlant.category;
    hungarianInput.value = currentPlant.hungarian;
    latinInput.value = currentPlant.latin;
    familyInput.value = currentPlant.family;
    genusInput.value = currentPlant.genus;
    renderImages();

}

function renderImages() {

    imageList.innerHTML = "";

    if (!currentPlant || !currentPlant.images) {
        return;
    }

    currentPlant.images.forEach((image, index) => {

        const card = document.createElement("div");
        card.className = "imageCard";
        card.innerHTML = `
            <img src="../${image}" loading="lazy" draggable="false" onerror="this.src='../images/no-image.png'">
            <div class="imageName">${image.split("/").pop()}</div>
            <button class="deleteImage" data-index="${index}">✖</button>`;

        const img = card.querySelector("img");

        img.onclick = () => {window.open("../" + image, "_blank");};

        card.querySelector(".deleteImage").onclick = () => {removeImage(index);};

        imageList.appendChild(card);

    });
}

// =====================================================
// 
// =====================================================

searchBox.oninput = () => {

    const text =
        searchBox.value
            .trim()
            .toLowerCase();

    filteredPlants =

        plants.filter(plant =>

            plant.hungarian
                .toLowerCase()
                .includes(text)

            ||

            plant.latin
                .toLowerCase()
                .includes(text)

            ||

            plant.family
                .toLowerCase()
                .includes(text)

            ||

            plant.genus
                .toLowerCase()
                .includes(text)

            ||

			plant.category
			    .toLowerCase()
                .includes(text)
        );

    renderPlantList();

};

// =====================================================
// Új növény
// =====================================================

newButton.onclick = () => {

    if (!projectOpened) {

        return;

    }

    const nextId =

        plants.length === 0

            ? 1

            : Math.max(...plants.map(p => p.id)) + 1;

    currentPlant = {

        id: nextId,
        category: "trees",
        hungarian: "",
        latin: "",
        family: "",
        genus: "",
        images: [],
        stats: {correct: 0, wrong: 0, lastSeen: null}

    };

    plants.push(currentPlant);

    filteredPlants = [...plants];

    loadPlant();

    renderPlantList();

    status.innerText = "Új növény létrehozva.";

};

// =====================================================
// Képernyő -> objektum
// =====================================================

function saveFormToPlant() {

    if (!currentPlant) {

        return;

    }

    currentPlant.category = categoryInput.value;
    currentPlant.hungarian = hungarianInput.value.trim();
    currentPlant.latin = latinInput.value.trim();
    currentPlant.family = familyInput.value.trim();
    currentPlant.genus = genusInput.value.trim();

}

// =====================================================
// Automatikus frissítés
// =====================================================

categoryInput.onchange = saveFormToPlant;
hungarianInput.oninput = saveFormToPlant;
latinInput.oninput = saveFormToPlant;
familyInput.oninput = saveFormToPlant;
genusInput.oninput = saveFormToPlant;

// =====================================================
// Törlés
// =====================================================

deleteButton.onclick = () => {

    if (!currentPlant) {

        return;

    }

    if (!confirm("Biztosan törlöd ezt a növényt?")) {

        return;

    }

    plants = plants.filter(plant => plant.id !== currentPlant.id);

    filteredPlants = [...plants];
    currentPlant = null;
    clearEditor();
	if (plants.length > 0) {

		selectPlant(plants[0].id);

	}
    renderPlantList();
    status.innerText = "Növény törölve.";

};

// =====================================================

function clearEditor() {

    idInput.value = "";
    categoryInput.value = "trees";
    hungarianInput.value = "";
    latinInput.value = "";
    familyInput.value = "";
    genusInput.value = "";
    imageList.innerHTML = "";

}

// =====================================================
// Ellenőrzések
// =====================================================

function validatePlant() {

    if (!currentPlant) {

        return false;

    }

    if (currentPlant.hungarian === "") {

        alert("Hiányzik a magyar név.");

        return false;

    }

    if (currentPlant.latin === "") {

        alert("Hiányzik a latin név.");

        return false;

    }

    const duplicate = plants.find(

        plant =>

            plant.id !== currentPlant.id &&

            plant.latin.toLowerCase() ===

            currentPlant.latin.toLowerCase()

    );

    if (duplicate) {

        alert("Ez a latin név már létezik.");

        return false;

    }

    return true;

}

// ----------------------------
// Mentés
// ----------------------------

saveButton.onclick = async () => {

    if (!currentPlant) {

        alert("Nincs kijelölt növény.");

        return;

    }

    saveFormToPlant();

    if (!validatePlant()) {

        return;

    }

    try {

		sortPlants();
		
        const ok = await window.api.savePlants(plants);

        if (ok) {

            status.innerText = "Mentés sikeres.";

            const id = currentPlant.id;

			refreshList();

			selectPlant(id);

        }
        else {

            alert("Nem sikerült a mentés.");

        }

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

};

// =====================================================
// Kép hozzáadása
// =====================================================

addImageButton.onclick = async () => {

    if (!currentPlant) {

        return;

    }

	if (!currentPlant.latin.trim()) {

		alert("Először add meg a latin nevet.");

		return;

	}
    
	const sourceFile = await window.api.selectImage();

    if (!sourceFile) {

        return;

    }

    const latinName =

        currentPlant.latin
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_");

    let nextNumber = 1;

    currentPlant.images.forEach(image => {

        const match = image.match(/(\d+)\.[a-z]+$/i);

        if (match) {

            const n = Number(match[1]);

            if (n >= nextNumber) {

                nextNumber = n + 1;

            }

        }

    });

    const targetName = latinName + nextNumber;

    const relativePath = await window.api.copyImage(sourceFile, targetName);

    if (!relativePath) {

        alert("A kép másolása sikertelen.");

        return;

    }

    currentPlant.images.push(relativePath);

    renderImages();

    status.innerText = "Kép hozzáadva.";

};

// =====================================================
// Kép törlése
// =====================================================

function removeImage(index) {

    if (!currentPlant) {

        return;

    }

    currentPlant.images.splice(index, 1);

    renderImages();

}

// =====================================================
// Rendezés
// =====================================================

function sortPlants() {

    plants.sort((a, b) =>

        a.hungarian.localeCompare(

            b.hungarian,

            "hu"

        )

    );

}

// =====================================================
// Lista frissítés
// =====================================================

function refreshList() {

    sortPlants();

    filteredPlants = [...plants];

    renderPlantList();

}

// =====================================================
// Állapot
// =====================================================

window.addEventListener("beforeunload", event => {

    if (!projectOpened) {

        return;

    }

    event.preventDefault();

    event.returnValue = "";

});

// =====================================================
// Segédfüggvény
// =====================================================

function getPlantById(id) {

    return plants.find(

        plant => plant.id === id

    );

}
