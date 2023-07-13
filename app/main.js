const { app, BrowserWindow, ipcMain, shell } = require("electron");
const { autoUpdater } = require("electron-updater");
const isDev = require("electron-is-dev");
const { Config, DataReader } = require("./utils");
const path = require("path");

// Remove security warnings
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

const instanceLock = app.requestSingleInstanceLock();

let mainWindow = null;

// AutoUpdater Setup

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;

autoUpdater.on("update-available", () => {
    if (mainWindow && mainWindow instanceof BrowserWindow) {
        mainWindow.webContents.send("update-available");
    }
});

autoUpdater.on("update-downloaded", () => {
    if (mainWindow && mainWindow instanceof BrowserWindow) {
        mainWindow.webContents.send("update-downloaded");
    }
});

const main = async () => {
    Config.checkFolders();

    // Main page
    mainWindow = new BrowserWindow({
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
    ipcMain.on("start-get-data", () =>
        mainWindow.webContents.send("res-data", DataReader.read(Config.getAppOptions().dataPath))
    );
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
        mainWindow.webContents.send("res-data", DataReader.read(Config.getAppOptions().dataPath));
    });

    // IPC Setup - Update
    ipcMain.on("start-update-download", () => {
        autoUpdater.downloadUpdate();
    });
    ipcMain.on("start-update-restart", () => {
        autoUpdater.quitAndInstall(true, true);
    });

    // Check Update
    autoUpdater.checkForUpdatesAndNotify();
};

if (!instanceLock) {
    app.quit();
} else {
    app.on("second-instance", _ => {
        if (mainWindow && mainWindow instanceof BrowserWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
    app.once("ready", main);
}
