/* eslint-disable react/prop-types */
import React from "react";
import "./UpdateModal.css";
import { FcDownload } from "react-icons/fc";

const UpdateModal = props => {
    return (
        <div className="background" onClick={() => props.setUpdate("hidden")}>
            <div className="frame" onClick={event => event.stopPropagation()}>
                <div className="frame_top">
                    <span>Mise à jour</span>
                    <button className="close" onClick={() => props.setUpdate("hidden")}>
                        X
                    </button>
                </div>
                <div className="frame_content">
                    {props.update === "visible" && (
                        <>
                            <p>
                                Une mise à jour est disponible ! Cliquez ci-dessous pour la
                                télécharger.
                            </p>
                            <button
                                onClick={() => {
                                    window.electron.downloadUpdate();
                                    props.setUpdate("downloading");
                                }}
                            >
                                <FcDownload />
                            </button>
                        </>
                    )}
                    {props.update === "downloading" && (
                        <>
                            <p>Téléchargement de la mise à jour en cours...</p>
                        </>
                    )}
                    {props.update === "downloaded" && (
                        <>
                            <p>
                                Téléchargement terminé ! Cliquez ci-dessous pour lancer la mise à
                                jour.
                            </p>
                            <button onClick={() => window.electron.restartUpdate()}></button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateModal;
