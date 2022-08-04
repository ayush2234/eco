/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, switchMap } from 'rxjs';
import { SelectOption } from '../../integrations.types';

@Injectable({
    providedIn: 'root',
})
export class AddIntegrationOrdersService {
    // Private
    private _customerOptionsSelectOptionsErp: BehaviorSubject<
        SelectOption[] | null
    > = new BehaviorSubject(null);
    private _existingCustomerSelectOptionsErp: BehaviorSubject<
        SelectOption[] | null
    > = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get customerOptionsSelectOptionsErp$(): Observable<SelectOption[]> {
        return this._customerOptionsSelectOptionsErp.asObservable();
    }

    get existingCustomerSelectOptionsErp$(): Observable<SelectOption[]> {
        return this._existingCustomerSelectOptionsErp.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getCustomerOptionsSelectOptionsErp(api: string): Observable<any> {
        return this._httpClient.get(api).pipe(
            tap((response: any) => {
                this._customerOptionsSelectOptionsErp.next(response);
            })
        );
    }

    /**
     * Get data
     */
    getExistingCustomerSelectOptionsErp(api: string): Observable<any> {
        return this._httpClient.get(api).pipe(
            tap((response: any) => {
                this._customerOptionsSelectOptionsErp.next(response);
            })
        );
    }
}
