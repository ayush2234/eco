import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  checkIfCustomerExists(value: string): Observable<any> {
    return this._httpClient
      .get('api/v1/erpInstallId/customers')
      .pipe(map((res: any) => res?.customer?.some(a => a.username === value)));
  }
}
