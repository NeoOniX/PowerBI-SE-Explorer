const { join } = require("path");
const fs = require("fs");
const Config = require("./Config");

/**
 * @typedef {Object} ExportData
 * @property {string} WorkspaceName
 * @property {string} WorkspaceIcon
 * @property {string} ContentName
 * @property {string} ContentType
 * @property {string} PageName
 * @property {string} URL
 * @property {Array<string>} Tags
 *
 * @typedef {Object} AnomalyData
 * @property {string} WorkspaceName
 * @property {string} WorkspaceIcon
 * @property {string} ContentName
 * @property {string} ContentType
 * @property {string} URL
 * @property {string} Reason
 *
 * @typedef {Object} Data
 * @property {Array<ExportData>} Exports
 * @property {Array<AnomalyData>} Anomalies
 */

/**
 * @class
 * @public
 */
class DataReader {
    /**
     * Read data from the export path
     * @returns {Data}
     * @public
     * @static
     */
    static read() {
        // Exports
        const exportsDataDict = {};
        const e = fs.readdirSync(join(Config.getAppOptions().dataPath, "/Exports/"));
        e.map(name => ({
            name,
            time: fs
                .statSync(join(Config.getAppOptions().dataPath, "/Exports/", name))
                .mtime.getTime(),
        }))
            .sort((a, b) => a.time - b.time)
            .forEach(file => {
                JSON.parse(
                    fs.readFileSync(join(Config.getAppOptions().dataPath, "/Exports/", file.name))
                ).forEach(exportData => {
                    const d = new Date(file.time);
                    exportsDataDict[exportData.URL] = {
                        ...exportData,
                        Update: `${d.getDate() < 10 ? "0" + d.getDate() : d.getDate()}/${
                            d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
                        }/${d.getFullYear()} à ${d.getHours()}:${
                            d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()
                        }`,
                    };
                });
            });

        // Anomalies
        const anomaliesDataDict = {};
        const a = fs.readdirSync(join(Config.getAppOptions().dataPath, "/Anomalies/"));
        a.map(name => ({
            name,
            time: fs
                .statSync(join(Config.getAppOptions().dataPath, "/Anomalies/", name))
                .mtime.getTime(),
        }))
            .sort((a, b) => a.time - b.time)
            .forEach(file => {
                JSON.parse(
                    fs.readFileSync(join(Config.getAppOptions().dataPath, "/Anomalies/", file.name))
                ).forEach(anomalyData => {
                    const d = new Date(file.time);
                    anomaliesDataDict[anomalyData.URL] = {
                        ...anomalyData,
                        Update: `${d.getDate() < 10 ? "0" + d.getDate() : d.getDate()}/${
                            d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
                        }/${d.getFullYear()} à ${d.getHours()}:${
                            d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()
                        }`,
                    };
                });
            });

        return {
            Exports: Object.values(exportsDataDict),
            Anomalies: Object.values(anomaliesDataDict),
        };
    }
}

module.exports = DataReader;
