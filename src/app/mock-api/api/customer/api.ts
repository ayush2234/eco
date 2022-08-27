import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { customers } from 'app/mock-api/api/customer/data';

@Injectable({
  providedIn: 'root',
})
export class CustomerMockApi {
  private _customers: any = customers;

  /**
   * Constructor
   */
  constructor(private _fuseMockApiService: FuseMockApiService) {
    // Register Mock API handlers
    this.registerHandlers();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register Mock API handlers
   */
  registerHandlers(): void {
    // -----------------------------------------------------------------------------------------------------
    // @ Customers - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onGet('api/v1/erpInstallId/customers')
      .reply(() => [200, cloneDeep(this._customers)]);
  }
}
