const { contextBridge, ipcRenderer, webFrame } = require("electron");

webFrame.setZoomFactor(1);

contextBridge.exposeInMainWorld("electron", {
    // App Options
    getAppOptions() {
        ipcRenderer.send("start-get-app-options");
    },
    setAppOptions(options) {
        ipcRenderer.send("start-set-app-options", options);
    },
    setExportPath() {
        ipcRenderer.send("start-set-export-path");
    },
    addOnAppOptionsReceivedListener(listener) {
        ipcRenderer.on("res-app-options", (event, args) => {
            listener(args);
        });
    },
    // Data
    getData() {
        ipcRenderer.send("start-get-data");
    },
    setDataListener(listener) {
        ipcRenderer.removeAllListeners("res-data");
        ipcRenderer.on("res-data", (event, args) => {
            listener(args);
        });
    },
    // External open
    openInBrowser(url) {
        ipcRenderer.send("open-in-browser", url);
    },
});
