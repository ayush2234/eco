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
export class ConnectionsResolver implements Resolve<any> {
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
        return this._integrationsService.getConnections();
    }
}
