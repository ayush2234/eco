import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { IPagination, ITag } from 'app/layout/common/types/grid.types';
import { Observable } from 'rxjs';
import { IntegrationService } from './integration.service';
import { Integration } from './integration.types';

@Injectable({
    providedIn: 'root',
})
export class IntegrationResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _integrationService: IntegrationService) {}

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
        integrations: Integration[];
    }> {
        return this._integrationService.getIntegrations();
    }
}

@Injectable({
    providedIn: 'root',
})
export class IntegrationRestrictedToCompanyResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _integrationService: IntegrationService) {}

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
        return this._integrationService.getRestrictedToCompanyTags();
    }
}

@Injectable({
    providedIn: 'root',
})
export class IntegrationSourceResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _integrationService: IntegrationService) {}

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
        return this._integrationService.getSourceTags();
    }
}
