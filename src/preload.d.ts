declare global {
    // Interfaces

    interface AppOptions {
        dataPath: string;
    }

    interface ExportData {
        WorkspaceName: string;
        WorkspaceIcon: string;
        ContentName: string;
        ContentType: ContentType;
        PageName: string;
        URL: string;
        Tags: Array<string>;
    }

    interface AnomalyData {
        WorkspaceName: string;
        WorkspaceIcon: string;
        ContentName: string;
        ContentType: ContentType;
        URL: string;
        Reason: string;
    }

    interface Data {
        Exports: Array<ExportData>;
        Anomalies: Array<AnomalyData>;
    }

    // Expose to DOM
    interface Window {
        electron: {
            // App Options
            getAppOptions(): void;
            setAppOptions(options: AppOptions): void;
            setExportPath(): void;
            addOnAppOptionsReceivedListener(listener: (config: AppOptions) => void): void;
            // Data
            getData(): void;
            setDataListener(listener: (data: Data) => void): void;
            // External open
            openInBrowser(url: string): void;
        };
    }
}

export {};
