import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { IPagination, ITag } from 'app/layout/common/types/grid.types';
import { Observable } from 'rxjs';
import { SourceService } from './source.service';
import { Source } from './source.types';

@Injectable({
    providedIn: 'root',
})
export class SourceResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _sourceService: SourceService) {}

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
        sources: Source[];
    }> {
        return this._sourceService.getSources();
    }
}

@Injectable({
    providedIn: 'root',
})
export class SourceRestrictedToCompanyResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _sourceService: SourceService) {}

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
    ): Observable<ITag[]> {
        return this._sourceService.getRestrictedToCompanyTags();
    }
}

@Injectable({
    providedIn: 'root',
})
export class SourceSourceResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _sourceService: SourceService) {}

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
    ): Observable<ITag[]> {
        return this._sourceService.getIntegrationTags();
    }
}
