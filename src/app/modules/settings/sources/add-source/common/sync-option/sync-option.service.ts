/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, switchMap, map } from 'rxjs';
// import { SelectOption } from '../../add-source.types';
// import { Source } from '../../../source.types';
import { SelectOption } from '../../add-source.types';
import { Source } from '../../../source.types';

@Injectable({
  providedIn: 'root',
})
export class SyncOptionService {
  // Private
  private _selectedSource: BehaviorSubject<string | null> = new BehaviorSubject(
    null
  );
  private _wipSource: BehaviorSubject<Source | null> = new BehaviorSubject(
    null
  );

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  set wipSource(value: Source) {
    this._wipSource.next(value);
  }

  get wipSource$(): Observable<Source> {
    return this._wipSource.asObservable();
  }

  get selectedSource$(): Observable<Source | any> {
    return this._selectedSource.asObservable().pipe(
      switchMap(id => of()),
      tap(Source => {
        this._wipSource.next(Source);
      })
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Set selected Source
   */
  setSelectedSource(value: string): void {
    this._selectedSource.next(value);
  }

  /**
   * Get select options
   */
  getSelectOptions(key: string, api: string): Observable<SelectOption[]> {
    return this._httpClient.get(api).pipe(
      map((res: any) => {
        switch (key) {
          case 'take_stock_from':
            const warehouses = res?.wareHouse?.reduce(
              (arr, value) =>
                value
                  ? [
                      ...arr,
                      {
                        option: value.wareHouseID,
                        label: value.wareHouseName,
                      },
                    ]
                  : [...arr],
              []
            );

            return warehouses;
          default:
            return res;
        }
      })
    );
  }

  /**
   * Get mapping
   */
  getMapping(key: string, api: string): Observable<SelectOption[]> {
    return this._httpClient.get(api).pipe(
      map((res: any) => {
        switch (key) {
          case 'ship_method_mapping':
            const shippingMethods =
              res?.shippingMethods?.shippingMethod?.reduce(
                (arr, value) =>
                  value
                    ? [
                        ...arr,
                        {
                          option: value.id,
                          label: value.name,
                        },
                      ]
                    : [...arr],
                []
              );

            return shippingMethods;
          default:
            return res;
        }
      })
    );
  }
}
