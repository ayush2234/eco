import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    filter,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { IPagination, ITag } from 'app/layout/common/types/grid.types';
import { SyncLog } from './sync-logs.types';

@Injectable({
    providedIn: 'root',
})
export class SyncLogsService {
    // Private
    private _syncLog: BehaviorSubject<SyncLog | null> = new BehaviorSubject(
        null
    );
    private _syncLogs: BehaviorSubject<SyncLog[] | null> = new BehaviorSubject(
        null
    );
    private _pagination: BehaviorSubject<IPagination | null> =
        new BehaviorSubject(null);
    private _tags: BehaviorSubject<ITag[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for syncLog
     */
    get syncLog$(): Observable<SyncLog> {
        return this._syncLog.asObservable();
    }

    /**
     * Getter for syncLogs
     */
    get syncLogs$(): Observable<SyncLog[]> {
        return this._syncLogs.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<IPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for tags
     */
    get tags$(): Observable<ITag[]> {
        return this._tags.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get syncLogs
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getSyncLogs(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: IPagination;
        syncLogs: SyncLog[];
    }> {
        return this._httpClient
            .get<{
                pagination: IPagination;
                syncLogs: SyncLog[];
            }>('api/common/sync-logs', {
                params: {
                    page: '' + page,
                    size: '' + size,
                    sort,
                    order,
                    search,
                },
            })
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._syncLogs.next(response.syncLogs);
                })
            );
    }

    /**
     * Get syncLog by id
     */
    getSyncLogById(id: string): Observable<SyncLog> {
        return this._syncLogs.pipe(
            take(1),
            map((syncLogs) => {
                // Find the syncLog
                const syncLog =
                    syncLogs.find((item) => item.syncId === id) || null;

                // Update the syncLog
                this._syncLog.next(syncLog);

                // Return the syncLog
                return syncLog;
            }),
            switchMap((syncLog) => {
                if (!syncLog) {
                    return throwError(
                        'Could not found syncLog with id of ' + id + '!'
                    );
                }

                return of(syncLog);
            })
        );
    }

    /**
     * Create syncLog
     */
    createSyncLog(): Observable<SyncLog> {
        return this.syncLogs$.pipe(
            take(1),
            switchMap((syncLogs) =>
                this._httpClient.post<SyncLog>('api/common/sync-log', {}).pipe(
                    map((newSyncLog) => {
                        // Update the syncLogs with the new syncLog
                        this._syncLogs.next([newSyncLog, ...syncLogs]);

                        // Return the new syncLog
                        return newSyncLog;
                    })
                )
            )
        );
    }

    /**
     * Update syncLog
     *
     * @param id
     * @param syncLog
     */
    updateSyncLog(id: string, syncLog: SyncLog): Observable<SyncLog> {
        return this.syncLogs$.pipe(
            take(1),
            switchMap((syncLogs) =>
                this._httpClient
                    .patch<SyncLog>('api/common/sync-log', {
                        id,
                        syncLog,
                    })
                    .pipe(
                        map((updatedSyncLog) => {
                            // Find the index of the updated syncLog
                            const index = syncLogs.findIndex(
                                (item) => item.syncId === id
                            );

                            // Update the syncLog
                            syncLogs[index] = updatedSyncLog;

                            // Update the syncLogs
                            this._syncLogs.next(syncLogs);

                            // Return the updated syncLog
                            return updatedSyncLog;
                        })
                    )
            )
        );
    }

    /**
     * Delete the syncLog
     *
     * @param id
     */
    deleteSyncLog(id: string): Observable<boolean> {
        return this.syncLogs$.pipe(
            take(1),
            switchMap((syncLogs) =>
                this._httpClient
                    .delete('api/common/sync-log', {
                        params: { id },
                    })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted syncLog
                            const index = syncLogs.findIndex(
                                (item) => item.syncId === id
                            );

                            // Delete the syncLog
                            syncLogs.splice(index, 1);

                            // Update the syncLogs
                            this._syncLogs.next(syncLogs);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }
}