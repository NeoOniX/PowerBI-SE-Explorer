const { join } = require("path");
const fs = require("fs");

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
     * @param {string} path Export path
     * @param {number} depth Subfolder depth
     * @returns {Data}
     * @public
     * @static
     */
    static read(path, depth = 3) {
        // Read folder & subfolders
        const files = [];
        let dirs = ["/"];

        for (let i = 0; i <= depth; i++) {
            const tmp_dirs = [];
            for (const dir of dirs) {
                fs.readdirSync(join(path, dir), { withFileTypes: true }).forEach(f => {
                    if (f.isDirectory()) tmp_dirs.push(join(dir, f.name));
                    if (f.isFile() && f.name.endsWith(".json")) files.push(join(path, dir, f.name));
                });
            }
            dirs = tmp_dirs;
        }

        const exportsDataDict = {};
        const anomaliesDataDict = {};

        files
            .map(fpath => ({
                fpath,
                time: fs.statSync(fpath).mtime.getTime(),
            }))
            .sort((a, b) => b.time - a.time)
            .forEach(f => {
                const d = new Date(f.time);
                const Update = `${d.getDate() < 10 ? "0" + d.getDate() : d.getDate()}/${
                    d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
                }/${d.getFullYear()} à ${d.getHours()}:${
                    d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()
                }`;
                try {
                    JSON.parse(fs.readFileSync(f.fpath)).forEach(data => {
                        if (data["Reason"] === undefined) {
                            exportsDataDict[data.URL] = {
                                ...data,
                                Update,
                            };
                        } else {
                            anomaliesDataDict[data.URL] = {
                                ...data,
                                Update,
                            };
                        }
                    });
                } catch (error) {
                    /* empty */
                }
            });

        return {
            Exports: Object.values(exportsDataDict),
            Anomalies: Object.values(anomaliesDataDict),
        };
    }
}

module.exports = DataReader;
