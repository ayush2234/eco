/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, switchMap } from 'rxjs';
import { SelectOption } from '../../integrations.types';

@Injectable({
    providedIn: 'root',
})
export class AddIntegrationInventoryService {
    // Private
    private _takeStockFromSelectOptions: BehaviorSubject<
        SelectOption[] | null
    > = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get takeStockFromSelectOptions$(): Observable<SelectOption[]> {
        return this._takeStockFromSelectOptions.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getTakeStockFromSelectOptions(api: string): Observable<any> {
        return this._httpClient.get(api).pipe(
            tap((response: any) => {
                this._takeStockFromSelectOptions.next(response);
            })
        );
    }
}
