/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import Select from "react-select";
import IconOption from "../components/IconOption/IconOption";
import PreviewModal from "../components/PreviewModal/PreviewModal";
import { FcOpenedFolder, FcSynchronize, FcCancel } from "react-icons/fc";
import { BiMoon, BiSun } from "react-icons/bi";
import UpdateModal from "../components/UpdateModal/UpdateModal";

const Explore = props => {
    // Data
    const [data, setData] = useState({ Exports: [], Anomalies: [] });
    const [show, setShow] = useState({ Exports: [], Anomalies: [] });

    useEffect(() => {
        window.electron.setDataListener(data => {
            setData(data);

            const out = [];

            for (const ed of data.Exports) {
                if (out.find(w => w.value === ed.WorkspaceName) === undefined) {
                    out.push({
                        value: ed.WorkspaceName,
                        label: ed.WorkspaceName,
                        icon: ed.WorkspaceIcon,
                    });
                }
            }

            setOptions(out);
        });
        window.electron.getData();
    }, []);

    // Selection & Search
    const [currentSelection, setCurrentSelection] = useState([]);
    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        let out = [];
        // Limit to selection

        if (currentSelection.length === 0) {
            out = data.Exports;
        }

        for (const sel of currentSelection) {
            out = [...out, ...data.Exports.filter(w => w.WorkspaceName === sel.value)];
        }

        // Search
        const out2 = {};
        for (const s of search.split(" ")) {
            if (s.length === 0) continue;
            out.forEach(w => {
                for (const t of w.Tags.split(";")) {
                    if (t.startsWith(s)) {
                        const uid = `${w.WorkspaceName}-${w.ContentName}-${w.PageName}`;
                        if (out2[uid] === undefined) out2[uid] = { ...w, Count: 0 };
                        out2[uid].Count++;
                    }
                }
            });
            // out.filter(w => w.Tags.split(";").includes(s)).forEach(w => {
            //     const uid = `${w.WorkspaceName}-${w.ContentName}-${w.PageName}`;
            //     if (out2[uid] === undefined) out2[uid] = { ...w, Count: 0 };
            //     out2[uid].Count++;
            // });
        }
        out = search.length !== 0 ? Object.values(out2).sort((a, b) => b.Count - a.Count) : out;

        console.log(out);

        setShow({ Anomalies: data.Anomalies, Exports: out });
    }, [currentSelection, data, search]);

    // Preview
    const [preview, setPreview] = useState(null);

    // Update
    const [update, setUpdate] = useState("hidden");
    useEffect(() => {
        window.electron.setUpdateAvailableListener(() => {
            setUpdate("visible");
        });

        window.electron.setUpdateDownloadedListener(() => {
            setUpdate("downloaded");
        });
    });

    return (
        <>
            {preview !== null && <PreviewModal preview={preview} setPreview={setPreview} />}
            {update !== "hidden" && <UpdateModal update={update} setUpdate={setUpdate} />}
            <div className="topbar">
                <button onClick={() => window.electron.setExportPath()}>
                    <FcOpenedFolder />
                    Ouvrir un dossier
                </button>
                <div className="separator"></div>
                <button onClick={() => window.electron.getData()}>
                    <FcSynchronize />
                    Recharger les données
                </button>
                <button onClick={() => props.setPage("anomalies")}>
                    <FcCancel />
                    Voir les anomalies
                </button>
                <div className="separator"></div>
                <button className="square" onClick={() => props.setLightTheme(!props.lightTheme)}>
                    {props.lightTheme ? <BiSun color="#ffff00" /> : <BiMoon color="#e0e7ff" />}
                </button>
            </div>
            <div className="search_header">
                <div>
                    <label htmlFor="search">Rechercher:</label>
                    <input
                        className="search_filter"
                        type="text"
                        name="search"
                        id="search"
                        onChange={e => setSearch(e.target.value.toLowerCase())}
                    />
                </div>
                <div>
                    <span>Espace:</span>
                    <Select
                        className="search_filter searchbox"
                        placeholder={"Espace de travail..."}
                        onChange={setCurrentSelection}
                        options={options}
                        components={{ Option: IconOption }}
                        defaultValue={null}
                        noOptionsMessage={() => "Aucun"}
                        isMulti
                    />
                </div>
            </div>
            <div className="content h_center">
                <div className="search_head">
                    <span>Nom de la page</span>
                    <span>Nom du contenu</span>
                    <span>Type de contenu</span>
                    <span>Espace</span>
                    <span>Mis à jour le</span>
                </div>
                <div className="search_body">
                    {show.Exports.map(exp => {
                        return (
                            <div key={exp.URL} onClick={() => setPreview(exp)}>
                                <div>{exp.PageName}</div>
                                <div>{exp.ContentName}</div>
                                <div>{exp.ContentType}</div>
                                <div>
                                    <img
                                        src={
                                            exp.WorkspaceIcon !== null
                                                ? exp.WorkspaceIcon
                                                : "pbi-logo.svg"
                                        }
                                        style={{
                                            width: 36,
                                            height: 36,
                                            objectFit: "contain",
                                        }}
                                        alt={exp.WorkspaceName}
                                    />
                                    <span>{exp.WorkspaceName}</span>
                                </div>
                                <div>{exp.Update}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Explore;
