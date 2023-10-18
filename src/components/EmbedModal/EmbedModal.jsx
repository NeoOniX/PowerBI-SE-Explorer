/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "./EmbedModal.css";
import { BsClipboardData, BsTrash3 } from "react-icons/bs";
import { FcPlus, FcGlobe } from "react-icons/fc";

const EmbedModal = props => {
    const [filterPane, setFilterPane] = useState(false);
    const [pagesPane, setPagesPane] = useState(false);
    const [filters, setFilters] = useState([]);
    const [link, setLink] = useState("");

    const updateLink = () => {
        const outFltrs = [];

        for (const fl of filters) {
            if (fl[0].length > 0 && fl[1].length > 0 && fl[2].length > 0) {
                outFltrs.push(`${unicode(fl[0])} ${fl[1]} ${fl[2]}`);
            }
        }

        const urlFltrs = outFltrs.length > 0 ? `&filter=${outFltrs.join(" and ")}` : "";

        console.log(urlFltrs);

        setLink(
            `https://app.powerbi.com/reportEmbed?autoAuth=true&reportId=${props.embed.ContentId}&groupId=${props.embed.WorkspaceId}&pageName=${props.embed.PageId}&filterPaneEnabled=${filterPane}&navContentPaneEnabled=${pagesPane}${urlFltrs}`
        );
    };

    const replacer = [" ", ",", ";", "'", ":", "?", "!", "."];
    const unicode = text => {
        for (const r of replacer) {
            while (text.includes(r)) {
                text = text.replace(r, `_x${r.codePointAt(0).toString(16).padStart(4, "0")}_`);
            }
        }

        return text;
    };

    const handleKeyDown = event => {
        if (event.key === "Enter") {
            event.target.blur();
        }
    };

    useEffect(updateLink, [filterPane, pagesPane, filters]);

    const setFilter = (i, j, value) => {
        filters[i][j] = value;
        updateLink();
    };

    const removeFilter = j => {
        console.log(j);
        setFilters(filters.filter((f, i) => i !== j));
    };

    return (
        <div className="embed background" onClick={() => props.setEmbed(null)}>
            <div className="frame" onClick={event => event.stopPropagation()}>
                <div className="frame_top">
                    <span>{props.embed.PageName} - Incorporer</span>
                    <button className="close" onClick={() => props.setEmbed(null)}>
                        X
                    </button>
                </div>
                <div className="frame_content">
                    <div>
                        <div>
                            <div className="title">Aide Microsoft :</div>
                            <button
                                onClick={() =>
                                    window.electron.openInBrowser(
                                        "https://learn.microsoft.com/fr-fr/power-bi/collaborate-share/service-url-filters"
                                    )
                                }
                            >
                                <FcGlobe />
                            </button>
                        </div>
                        <div className="title">Lien d&apos;incorporation :</div>
                        <div>
                            <input
                                type="checkbox"
                                name="filter_pane"
                                value={filterPane}
                                onClick={() => setFilterPane(!filterPane)}
                            ></input>
                            <label htmlFor="filter_pane">Panneau de filtres</label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                name="pages_pane"
                                value={pagesPane}
                                onClick={() => setPagesPane(!pagesPane)}
                            ></input>
                            <label htmlFor="pages_pane">Panneau de pages</label>
                        </div>
                        <div className="frame_flex">
                            <button
                                className="frame_mr_15"
                                title="Copier au presse-papier"
                                onClick={() => {
                                    navigator.clipboard.writeText(link);
                                }}
                            >
                                <BsClipboardData />
                            </button>
                            <span>{link}</span>
                        </div>
                    </div>
                    <div>
                        <div className="title">Filtres :</div>
                        <button
                            title="Ajouter un filtre"
                            onClick={() => setFilters([...filters, ["", "", ""]])}
                        >
                            <FcPlus />
                        </button>
                        <div className="filters">
                            <div className="filter_title">
                                <span>Tableau/Colonne</span>
                                <span>Condition</span>
                                <span>Valeur</span>
                                <span className="filter_delete">
                                    <BsTrash3 />
                                </span>
                            </div>
                            {filters.map((filter, i) => (
                                <div key={`${i}-${filter[0]}-${filter[1]}-${filter[2]}`}>
                                    <input
                                        type="text"
                                        placeholder="Tableau/Colonne"
                                        defaultValue={filter[0]}
                                        onBlur={event => setFilter(i, 0, event.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Condition"
                                        defaultValue={filter[1]}
                                        onBlur={event => setFilter(i, 1, event.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Valeur"
                                        defaultValue={filter[2]}
                                        onBlur={event => setFilter(i, 2, event.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <div
                                        className="filter_delete"
                                        onClick={() => removeFilter(i)}
                                        title="Supprimer le filtre"
                                    >
                                        <BsTrash3 />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmbedModal;
