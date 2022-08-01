import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Integration } from './integrations.types';

@Injectable({
    providedIn: 'root',
})
export class IntegrationsService {
    // Private
    private _installed: BehaviorSubject<Integration | null> =
        new BehaviorSubject(null);
    private _available: BehaviorSubject<Integration[] | null> =
        new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for installed integration
     */
    get installed$(): Observable<Integration> {
        return this._installed.asObservable();
    }

    /**
     * Getter for integrations
     */
    get available$(): Observable<Integration[]> {
        return this._available.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get installed integrations
     */
    getInstalledIntegrations(): Observable<any> {
        return this._httpClient.get('api/integrations/installed').pipe(
            tap((response: any) => {
                this._installed.next(response);
            })
        );
    }

    /**
     * Get available integrationss
     */
    getAvailableIntegrations(): Observable<any> {
        return this._httpClient.get('api/integrations/available').pipe(
            tap((response: any) => {
                this._available.next(response);
            })
        );
    }
}