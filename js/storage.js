// =====================================================
// FloraQuiz v1.0 Final
// storage.js
// =====================================================

"use strict";

const STORAGE_KEYS = {

    STATS: "plantStats",
    CORRECT: "correct",
    TOTAL: "total",
    CATEGORY: "category",
    MODE: "quizMode"

};

// =====================================================
// Generic
// =====================================================

function load(key, defaultValue = null) {

    const value = localStorage.getItem(key);

    if (value === null) {
        return defaultValue;
    }

    try {

        return JSON.parse(value);

    } catch {

        return value;

    }

}

function save(key, value) {

    if (typeof value === "string") {

        localStorage.setItem(key, value);

    } else {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    }

}

// =====================================================
// Quiz score
// =====================================================

function getCorrectCount() {

    return Number(
        localStorage.getItem(STORAGE_KEYS.CORRECT)
    ) || 0;

}

function getTotalCount() {

    return Number(
        localStorage.getItem(STORAGE_KEYS.TOTAL)
    ) || 0;

}

function setCorrectCount(value) {

    localStorage.setItem(
        STORAGE_KEYS.CORRECT,
        value
    );

}

function setTotalCount(value) {

    localStorage.setItem(
        STORAGE_KEYS.TOTAL,
        value
    );

}

function resetScore() {

    setCorrectCount(0);

    setTotalCount(0);

}

// =====================================================
// Plant statistics
// =====================================================

function getAllPlantStats() {

    return load(
        STORAGE_KEYS.STATS,
        {}
    );

}

function saveAllPlantStats(stats) {

    save(
        STORAGE_KEYS.STATS,
        stats
    );

}

function getPlantStats(id) {

    const stats = getAllPlantStats();

    if (!stats[id]) {

        stats[id] = {

            correct: 0,
            wrong: 0,
            lastSeen: null

        };

        saveAllPlantStats(stats);

    }

    return stats[id];

}

function updatePlantStats(id, isCorrect) {

    const stats = getAllPlantStats();

    if (!stats[id]) {

        stats[id] = {

            correct: 0,
            wrong: 0,
            lastSeen: null

        };

    }

    if (isCorrect) {

        stats[id].correct++;

    } else {

        stats[id].wrong++;

    }

    stats[id].lastSeen =
        new Date().toISOString();

    saveAllPlantStats(stats);

}

// =====================================================
// Category
// =====================================================

function getCategory() {

    return (
        localStorage.getItem(STORAGE_KEYS.CATEGORY)
        || "trees"
    );

}

function setCategoryStorage(category) {

    localStorage.setItem(
        STORAGE_KEYS.CATEGORY,
        category
    );

}

// =====================================================
// Quiz mode
// =====================================================

function getQuizMode() {

    return (
        localStorage.getItem(STORAGE_KEYS.MODE)
        || "image"
    );

}

function setQuizMode(mode) {

    localStorage.setItem(
        STORAGE_KEYS.MODE,
        mode
    );

}

// =====================================================
// Reset everything
// =====================================================

function resetStatistics() {

    localStorage.removeItem(
        STORAGE_KEYS.STATS
    );

    resetScore();

}

// =====================================================
// Accuracy
// =====================================================

function getAccuracy() {

    const correct = getCorrectCount();
    const total = getTotalCount();

    if (total === 0) {

        return 0;

    }

    return Math.round(
        (correct / total) * 100
    );

}