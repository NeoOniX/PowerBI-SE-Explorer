/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./PreviewModal.css";
import { FcInternal } from "react-icons/fc";
import EmbedModal from "../EmbedModal/EmbedModal";

const PreviewModal = props => {
    const [embed, setEmbed] = useState(null);

    return (
        <>
            <div className="preview background" onClick={() => props.setPreview(null)}>
                <div className="frame" onClick={event => event.stopPropagation()}>
                    <div className="frame_top">
                        <span>{props.preview.PageName}</span>
                        <button onClick={() => window.electron.openInBrowser(props.preview.URL)}>
                            Ouvrir en ligne
                        </button>
                        <button className="close" onClick={() => props.setPreview(null)}>
                            X
                        </button>
                    </div>
                    <div className="frame_content">
                        <div className="location">
                            <div className="title">Emplacement :</div>
                            <div className="workspace">
                                <img
                                    src={
                                        props.preview.WorkspaceIcon !== null
                                            ? props.preview.WorkspaceIcon
                                            : "pbi-logo.svg"
                                    }
                                    style={{
                                        width: 36,
                                        height: 36,
                                        objectFit: "contain",
                                    }}
                                    alt={props.preview.WorkspaceName}
                                />
                                <span>{props.preview.WorkspaceName}</span>
                            </div>
                            <div className="arrow content_name">{props.preview.ContentName}</div>
                            <div className="arrow page_name">{props.preview.PageName}</div>
                        </div>
                        <div className="preview">
                            <div className="title">Prévisualisation :</div>
                            <img src={props.preview.Screenshot} />
                        </div>
                        <div className="tags">
                            <div className="title">Tags :</div>
                            <div>{props.preview.Tags.split(";").join(", ")}</div>
                        </div>
                        <div>
                            {props.preview.ContentType === "Rapport" && (
                                <>
                                    <div className="title">Lien d&apos;incorporation :</div>
                                    <div>
                                        <button
                                            title="Ouvrir l'éditeur d'incorporation"
                                            onClick={() => setEmbed(props.preview)}
                                        >
                                            <FcInternal />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {embed !== null && <EmbedModal embed={embed} setEmbed={setEmbed} />}
        </>
    );
};

export default PreviewModal;
