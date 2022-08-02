import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { IntegrationsService } from './integrations.service';

@Injectable({
    providedIn: 'root',
})
export class InstalledIntegrationsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _integrationsService: IntegrationsService) {}

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
    ): Observable<any> {
        return this._integrationsService.getInstalledIntegrations();
    }
}

@Injectable({
    providedIn: 'root',
})
export class AvailableIntegrationsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _integrationsService: IntegrationsService) {}

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
    ): Observable<any> {
        return this._integrationsService.getAvailableIntegrations();
    }
}

@Injectable({
    providedIn: 'root',
})
export class SourceChannelResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _integrationsService: IntegrationsService) {}

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
    ): Observable<any> {
        return this._integrationsService.getSourceChannel();
    }
}
