// =====================================================
// FloraQuiz Editor
// main.js
// 1. rész
// =====================================================

const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require("electron");

const fs = require("fs");

const path = require("path");

let mainWindow;

let projectFolder = null;

// =====================================================

function createWindow() {

    mainWindow = new BrowserWindow({

        width: 1500,

        height: 900,

        minWidth: 1200,

        minHeight: 700,

        webPreferences: {

            preload: path.join(
                __dirname,
                "preload.js"
            ),

            contextIsolation: true,

            nodeIntegration: false

        }

    });

    mainWindow.loadFile(

        "editor/index.html"

    );

    // Fejlesztéshez
    mainWindow.webContents.openDevTools();

}

// =====================================================

app.whenReady().then(() => {

    createWindow();

});

app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {

        app.quit();

    }

});

app.on("activate", () => {

    if (

        BrowserWindow.getAllWindows().length === 0

    ) {

        createWindow();

    }

});

// =====================================================
// Projekt kiválasztása
// =====================================================

ipcMain.handle(

    "select-project",

    async () => {

        const result =

            await dialog.showOpenDialog(

                mainWindow,

                {

                    title:

                        "FloraQuiz projekt kiválasztása",

                    properties: [

                        "openDirectory"

                    ]

                }

            );

        if (

            result.canceled ||

            result.filePaths.length === 0

        ) {

            return null;

        }

        projectFolder =

            result.filePaths[0];

        return projectFolder;

    }

);

// =====================================================
// plants.json betöltése
// =====================================================

ipcMain.handle(

    "load-plants",

    async () => {

        if (!projectFolder) {

            throw new Error(

                "Nincs projekt megnyitva."

            );

        }

        const jsonFile =

            path.join(

                projectFolder,

                "data",

                "plants.json"

            );

        if (

            !fs.existsSync(jsonFile)

        ) {

            throw new Error(

                "A plants.json nem található."

            );

        }

        const text =

            fs.readFileSync(

                jsonFile,

                "utf8"

            );

        return JSON.parse(text);

    }

);

// =====================================================
// plants.json mentése
// =====================================================

ipcMain.handle(

    "save-plants",

    async (

        event,

        plants

    ) => {

        if (!projectFolder) {

            return false;

        }

        const jsonFile =

            path.join(

                projectFolder,

                "data",

                "plants.json"

            );

        plants.sort(

            (a, b) => a.id - b.id

        );

        fs.writeFileSync(

            jsonFile,

            JSON.stringify(

                plants,

                null,

                2

            ),

            "utf8"

        );

        return true;

    }

);

// =====================================================
// Kép kiválasztása
// =====================================================

ipcMain.handle(

    "select-image",

    async () => {

        const result =

            await dialog.showOpenDialog(

                mainWindow,

                {

                    title: "Kép kiválasztása",

                    properties: [

                        "openFile"

                    ],

                    filters: [

                        {

                            name: "Images",

                            extensions: [

                                "jpg",

                                "jpeg",

                                "png",

                                "webp"

                            ]

                        }

                    ]

                }

            );

        if (

            result.canceled ||

            result.filePaths.length === 0

        ) {

            return null;

        }

        return result.filePaths[0];

    }

);

// =====================================================
// Kép másolása
// =====================================================

ipcMain.handle(

    "copy-image",

    async (

        event,

        sourceFile,

        targetName

    ) => {

        if (!projectFolder) {

            return null;

        }

        const imagesFolder =

            path.join(

                projectFolder,

                "images"

            );

        if (

            !fs.existsSync(imagesFolder)

        ) {

            fs.mkdirSync(

                imagesFolder,

                {

                    recursive: true

                }

            );

        }

        const extension =

            path.extname(sourceFile);

        const fileName =

            targetName + extension;

        const destination =

            path.join(

                imagesFolder,

                fileName

            );

        fs.copyFileSync(

            sourceFile,

            destination

        );

        return "images/" + fileName;

    }

);

// =====================================================
// Kép törlése
// =====================================================

ipcMain.handle(

    "delete-image",

    async (

        event,

        relativePath

    ) => {

        if (!projectFolder) {

            return false;

        }

        const file =

            path.join(

                projectFolder,

                relativePath

            );

        if (

            fs.existsSync(file)

        ) {

            fs.unlinkSync(file);

        }

        return true;

    }

);

// =====================================================
// Fájl létezik?
// =====================================================

ipcMain.handle(

    "file-exists",

    async (

        event,

        relativePath

    ) => {

        if (!projectFolder) {

            return false;

        }

        const file =

            path.join(

                projectFolder,

                relativePath

            );

        return fs.existsSync(file);

    }

);

// =====================================================
// Projekt mappa
// =====================================================

ipcMain.handle(

    "get-project-folder",

    () => {

        return projectFolder;

    }

);

// =====================================================
// Alkalmazás bezárása
// =====================================================

ipcMain.handle(

    "quit",

    () => {

        app.quit();

    }

);