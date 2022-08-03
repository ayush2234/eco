/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, switchMap } from 'rxjs';
import { Integration } from '../integrations.types';

@Injectable({
    providedIn: 'root',
})
export class AddIntegrationService {
    // Private
    private _selectedIntegration: BehaviorSubject<string | null> =
        new BehaviorSubject(null);
    private _wipIntegration: BehaviorSubject<string | null> =
        new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    set wipIntegration(value: any) {
        this._wipIntegration.next(value);
    }

    get wipIntegration$(): Observable<any> {
        return this._wipIntegration.asObservable();
    }

    get selectedIntegration$(): Observable<any> {
        return this._selectedIntegration.asObservable().pipe(
            switchMap((id) =>
                of({
                    connection: {
                        sync: ['products', 'inventory', 'orders', 'tracking'],
                    },
                    products: {
                        isActive: false,
                    },
                    inventory: {
                        isActive: false,
                    },
                    orders: {
                        isActive: false,
                    },
                    tracking: {
                        isActive: false,
                    },
                })
            ),
            tap((integration) => {
                this._wipIntegration.next(integration);
            })
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set selected integration
     */
    setSelectedIntegration(value: string): void {
        this._selectedIntegration.next(value);
    }
}
