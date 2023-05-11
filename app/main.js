const { app, BrowserWindow, ipcMain, shell } = require("electron");
const isDev = require("electron-is-dev");
const { Config, DataReader } = require("./utils");
const path = require("path");

// Remove security warnings
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

const main = async () => {
    Config.checkFolders();

    // Main page
    const mainWindow = new BrowserWindow({
        height: 810,
        width: 1440,
        backgroundColor: "#000000",
        icon: "assets/icon.ico",
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: false,
            preload: __dirname + "/preloads/preload.js",
        },
    });

    mainWindow.setMenu(null);

    // Open DevTools
    // mainWindow.webContents.openDevTools();

    // Load main page
    mainWindow.loadURL(
        isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`
    );

    // IPC Setup
    ipcMain.on("start-get-data", () => mainWindow.webContents.send("res-data", DataReader.read()));
    ipcMain.on("open-in-browser", (event, arg) => shell.openExternal(arg));

    // IPC Setup - AppOptions
    ipcMain.on("start-get-app-options", () => {
        mainWindow.webContents.send("res-app-options", Config.getAppOptions());
    });
    ipcMain.on("start-set-app-options", (event, arg) => {
        Config.setAppOptions(arg);
        mainWindow.webContents.send("res-app-options", Config.getAppOptions());
    });
    ipcMain.on("start-set-export-path", async () => {
        await Config.setExportPath();
        mainWindow.webContents.send("res-app-options", Config.getAppOptions());
        mainWindow.webContents.send("res-data", DataReader.read());
    });
};

app.once("ready", main);
