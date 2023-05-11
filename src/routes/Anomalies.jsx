/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { FcOpenedFolder, FcSynchronize, FcSearch } from "react-icons/fc";
import { BiMoon, BiSun } from "react-icons/bi";

const Anomalies = props => {
    // Data
    const [data, setData] = useState({ Exports: [], Anomalies: [] });

    useEffect(() => {
        window.electron.setDataListener(data => setData(data));
        window.electron.getData();
    }, []);

    return (
        <>
            <div className="topbar">
                <button onClick={() => window.electron.setExportPath()}>
                    <FcOpenedFolder />
                    Ouvrir un dossier
                </button>
                <div className="separator"></div>
                <button onClick={() => props.setPage("anomalies")}>
                    <FcSynchronize />
                    Recharger les données
                </button>
                <button onClick={() => props.setPage("explore")}>
                    <FcSearch />
                    Rechercher un contenu
                </button>
                <div className="separator"></div>
                <button className="square" onClick={() => props.setLightTheme(!props.lightTheme)}>
                    {props.lightTheme ? <BiSun color="#ffff00" /> : <BiMoon color="#e0e7ff" />}
                </button>
            </div>
            <div className="content h_center">
                <div className="search_head">
                    <span>Nom du contenu</span>
                    <span>Type de contenu</span>
                    <span>Espace</span>
                    <span>Raison</span>
                    <span>Survenu le</span>
                </div>
                <div className="search_body">
                    {data.Anomalies.map(exp => {
                        return (
                            <div
                                key={exp.URL}
                                onClick={() => window.electron.openInBrowser(exp.URL)}
                            >
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
                                <div>{exp.Reason}</div>
                                <div>{exp.Update}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Anomalies;
