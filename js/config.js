"use strict";

// =====================================================
// FloraQuiz Configuration
// =====================================================

const APP_NAME = "FloraQuiz";
const IMAGE_CACHE = "floraquiz-images-v1";
const QUESTION_DELAY = 2000;
const APP_VERSION = "3.0";

const DEV_MODE =

    location.hostname === "127.0.0.1" ||

    location.hostname === "localhost";

const VERSION_URL = "data/version.json";
const PLANTS_URL = "data/plants.json";
const IMAGES_URL = "data/images.json";
const UPDATE_URL = "data/version.json";
// -----------------------------------------------------
// Service Worker
// -----------------------------------------------------

const ENABLE_SERVICE_WORKER = !DEV_MODE;

// -----------------------------------------------------
// Online Update
// -----------------------------------------------------

const ENABLE_AUTO_UPDATE = true;

const UPDATE_INTERVAL = 30 * 60 * 1000;

// -----------------------------------------------------
// IndexedDB
// -----------------------------------------------------

const DATABASE_NAME = "floraquiz";

const DATABASE_VERSION = 1;

// -----------------------------------------------------
// Debug
// -----------------------------------------------------

function log(...args) {

    if (DEV_MODE) {

        console.log(...args);

    }

}