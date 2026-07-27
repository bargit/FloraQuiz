// =====================================================
// FloraQuiz Editor
// preload.js
// =====================================================

const {

    contextBridge,

    ipcRenderer

} = require("electron");

// =====================================================

contextBridge.exposeInMainWorld("api", {

    // Electron verzió

    version: process.versions.electron,

    // -------------------------------------------------
    // Projekt
    // -------------------------------------------------

    selectProject: () =>

        ipcRenderer.invoke(

            "select-project"

        ),

    getProjectFolder: () =>

        ipcRenderer.invoke(

            "get-project-folder"

        ),

    // -------------------------------------------------
    // plants.json
    // -------------------------------------------------

    loadPlants: () =>

        ipcRenderer.invoke(

            "load-plants"

        ),

    savePlants: (plants) =>

        ipcRenderer.invoke(

            "save-plants",

            plants

        ),

    // -------------------------------------------------
    // Képek
    // -------------------------------------------------

    selectImage: () =>

        ipcRenderer.invoke(

            "select-image"

        ),

    copyImage: (

        sourceFile,

        targetName

    ) =>

        ipcRenderer.invoke(

            "copy-image",

            sourceFile,

            targetName

        ),

    deleteImage: (

        relativePath

    ) =>

        ipcRenderer.invoke(

            "delete-image",

            relativePath

        ),

    fileExists: (

        relativePath

    ) =>

        ipcRenderer.invoke(

            "file-exists",

            relativePath

        ),

    // -------------------------------------------------
    // Alkalmazás
    // -------------------------------------------------

    quit: () =>

        ipcRenderer.invoke(

            "quit"

        )

});