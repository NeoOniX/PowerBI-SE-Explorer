import React, { useState, useEffect } from "react";
import Anomalies from "./routes/Anomalies";
import Explore from "./routes/Explore";
import "./App.css";

const App = () => {
    // Navigation
    const [page, setPage] = useState("explore");

    // Options
    const [options, setOptions] = useState({});

    useEffect(() => {
        window.electron.addOnAppOptionsReceivedListener(cfg => {
            setOptions(cfg);
        });

        window.electron.getAppOptions();
    }, []);

    const setLightTheme = lightTheme => {
        window.electron.setAppOptions({ ...options, lightTheme });
    };

    return (
        <>
            {options.lightTheme !== undefined && (
                <link rel="stylesheet" href={options.lightTheme ? "light.css" : "dark.css"}></link>
            )}
            {page === "explore" && options.lightTheme !== undefined && (
                <Explore
                    setPage={setPage}
                    lightTheme={options.lightTheme}
                    setLightTheme={setLightTheme}
                />
            )}
            {page === "anomalies" && options.lightTheme !== undefined && (
                <Anomalies
                    setPage={setPage}
                    lightTheme={options.lightTheme}
                    setLightTheme={setLightTheme}
                />
            )}
        </>
    );
};

export default App;
