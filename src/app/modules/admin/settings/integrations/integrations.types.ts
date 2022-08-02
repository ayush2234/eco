export interface Integration {
    installationId: string;
    integrationId: string;
    name: string;
    icon: string;
    neatStoreURL: string;
    description: string;
    isActive: boolean;
    isCustom: boolean;
    connection: {
        isActive: boolean;
        sync: string[];
    };
    products: {
        isActive: boolean;
    };
    inventory: {
        isActive: boolean;
    };
    orders: {
        isActive: boolean;
    };
    tracking: {
        isActive: boolean;
    };
}
