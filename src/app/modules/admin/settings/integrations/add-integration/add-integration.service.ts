import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Integration } from '../integrations.types';

@Injectable({
    providedIn: 'root',
})
export class AddIntegrationService {
    // Private
    private _selectedIntegration: BehaviorSubject<Integration | null> =
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
    get selectedIntegration$(): Observable<Integration> {
        return this._selectedIntegration.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set selected integration
     */
    setSelectedIntegration(value: Integration): void {
        this._selectedIntegration.next(value);
    }
}
