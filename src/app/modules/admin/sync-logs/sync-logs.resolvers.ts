import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { IPagination, ITag } from 'app/layout/common/types/grid.types';
import { catchError, Observable, throwError } from 'rxjs';
import { SyncLogsService } from './sync-logs.service';
import { SyncLog } from './sync-logs.types';

@Injectable({
    providedIn: 'root',
})
export class SyncLogsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _syncLogsService: SyncLogsService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<{
        pagination: IPagination;
        syncLogs: SyncLog[];
    }> {
        return this._syncLogsService.getSyncLogs();
    }
}
