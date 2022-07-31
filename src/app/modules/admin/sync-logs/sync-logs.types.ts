export interface SyncLog {
    id: string;
    logDate: string;
    source: string;
    sourceId: string;
    destinationId: string;
    message: string;
    result: string;
    avatar: string;
    email: string;
    isActionRequired: boolean;
    isSyncOn: boolean;
}
