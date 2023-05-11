/* eslint-disable react/prop-types */
import React from "react";
import "./PreviewModal.css";

const PreviewModal = props => {
    return (
        <div className="background" onClick={() => props.setPreview(null)}>
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
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;
