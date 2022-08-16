export interface Source {
    sourceId: string;
    name: string;
    icon: string;
    description: string;
    isBeta: boolean;
    isCustom: string;
    restrictedToCompanies: string[];
    integration: string[];
    connectionForm: string;
    testConnection: boolean;
    dateCreated: string;
    dateUpdated: string;
    installedInstances: number;
}
