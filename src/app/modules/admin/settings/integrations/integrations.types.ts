export interface Integration {
    integrationId: string;
    erpId: string;
    name: string;
    icon: string;
    description: string;
    isCustom: boolean;
    connectionForm: string;
    forceTestConnection: boolean;
    syncOptions: SyncOption[];
}

export interface SyncOption {
    key: string;
    name: string;
    isActive: boolean;
    form: string;
    attributes: Attribute[];
}

export interface Attribute {
    setting: string;
    fieldType: string;
    erpValuesList: string;
    installationValuesList: string;
    additionalOptions: any;
    dependency?: string;
    source?: string;
    destination?: string;
}

export interface SelectOption {
    option: string;
    label: string;
    isDefault: boolean;
}
