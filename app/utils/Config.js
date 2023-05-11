const fs = require("fs");
const { join } = require("path");
const { app, dialog } = require("electron");

const path = join(app.getPath("documents"), "PowerBI SE Explorer");

const defaultAppOptions = {
    dataPath: join(path, "/data/"),
    lightTheme: true,
};

/**
 * @typedef {Object} AppOptions
 * @property {String} dataPath Location of data files
 * @property {boolean} lightTheme Should use light theme
 */

/**
 * @class
 * @public
 */
class Config {
    /**
     * Application options
     * @type {AppOptions}
     * @private
     */
    static appOptions = {};

    /**
     * Get the application options
     * @returns {AppOptions}
     * @public
     * @static
     */
    static getAppOptions() {
        if (Object.keys(this.appOptions).length === 0) {
            if (!fs.existsSync(join(path, "app_cfg.json"))) {
                fs.writeFileSync(
                    join(path, "app_cfg.json"),
                    JSON.stringify(defaultAppOptions, null, 4)
                );
            }
            this.appOptions = JSON.parse(fs.readFileSync(join(path, "app_cfg.json")));
        }

        return this.appOptions;
    }

    /**
     * Set the application options
     * @param {AppOptions} options Application options
     * @public
     * @static
     */
    static setAppOptions(options) {
        fs.writeFileSync(join(path, "app_cfg.json"), JSON.stringify(options, null, 4));
        this.appOptions = options;
    }

    /**
     * Open a file dialog to select the export path
     * @returns {Promise<void>}
     * @public
     * @static
     * @async
     */
    static async setExportPath() {
        try {
            const ret = await dialog.showOpenDialog({
                defaultPath: this.appOptions.dataPath,
                properties: ["openDirectory", "dontAddToRecent", "createDirectory"],
            });
            if (!ret.canceled) {
                const options = this.getAppOptions();
                options.dataPath = ret.filePaths[0];
                this.setAppOptions(options);
            }
        } catch (error) {
            /* empty */
        } finally {
            this.checkFolders();
            return;
        }
    }

    /**
     * Check if the folders exists, if not create them
     * @public
     * @static
     */
    static checkFolders() {
        // Default folders
        const folders = ["/data/"];
        for (const folder of folders) {
            if (!fs.existsSync(join(path, folder))) {
                fs.mkdirSync(join(path, folder), { recursive: true });
            }
        }

        // Export folder
        const subfolders = ["/Anomalies/", "/Exports/"];
        for (const folder of subfolders) {
            if (!fs.existsSync(join(this.getAppOptions().dataPath, folder))) {
                fs.mkdirSync(join(this.getAppOptions().dataPath, folder), { recursive: true });
            }
        }
    }
}

module.exports = Config;
