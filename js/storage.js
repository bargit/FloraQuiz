// ==========================
// FloraQuiz Storage
// ==========================

function getPlantStats(id) {

    const stats = JSON.parse(localStorage.getItem("plantStats") || "{}");

    if (!stats[id]) {

        stats[id] = {
            correct: 0,
            wrong: 0,
            lastSeen: 0
        };

    }

    return stats[id];

}

function savePlantStats(id, plantStat) {

    const stats = JSON.parse(localStorage.getItem("plantStats") || "{}");

    stats[id] = plantStat;

    localStorage.setItem("plantStats", JSON.stringify(stats));

}

function updatePlant(correctAnswer) {

    const stat = getPlantStats(currentPlant.id);

    if (correctAnswer) {

        stat.correct++;

    } else {

        stat.wrong++;

    }

    stat.lastSeen = Date.now();

    savePlantStats(currentPlant.id, stat);

}