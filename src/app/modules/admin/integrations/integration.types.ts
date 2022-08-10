import { ITag } from 'app/layout/common/types/grid.types';

export interface Integration {
    integrationId: string;
    sourceId: string[];
    name: string;
    icon: string;
    description: string;
    restrictedToCompanies: string[];
    isBeta: boolean;
    isCustom: string;
    forceTestConnection: boolean;
    jsonFormSchemaFile: string;
    dateCreated: string;
    dateUpdated: string;
    installedInstances: number;
}

export interface Company {
    companyId: string;
    companyName: string;
    notes: string;
    isActive: boolean;
    status: string;
    allowBeta: boolean;
    limits: Limit[];
}

export interface Limit {
    users?: Users;
    sources?: Sources;
    integrations?: Integrations;
    skus?: Skus;
}

export interface Users {
    limit: number;
    used: number;
}

export interface Sources {
    limit: number;
    used: number;
}

export interface Integrations {
    limit: number;
    used: number;
}

export interface Skus {
    limit: number;
    used: number;
}
